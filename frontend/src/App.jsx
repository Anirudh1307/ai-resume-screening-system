import { startTransition, useDeferredValue, useEffect, useState } from "react";

import {
  deleteResume,
  fetchCandidates,
  fetchJobs,
  fetchRankings,
  processResumes,
  uploadJob,
  uploadResumes,
} from "./api/client";
import CandidateTable from "./components/CandidateTable";
import FilterBar from "./components/FilterBar";
import ResumeLibrary from "./components/ResumeLibrary";
import SummaryCards from "./components/SummaryCards";
import UploadPanel from "./components/UploadPanel";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [activeJobId, setActiveJobId] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [appliedSkillFilter, setAppliedSkillFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [message, setMessage] = useState("System ready. Add a job description to begin.");

  // Defer large ranking list updates so filtering and uploads feel responsive.
  const deferredRankings = useDeferredValue(rankings);
  const activeJob = jobs.find((job) => job.id === activeJobId) || null;

  useEffect(() => {
    async function loadInitialData() {
      setBusy(true);
      try {
        const [jobData, candidateData] = await Promise.all([
          fetchJobs(),
          fetchCandidates(),
        ]);
        setJobs(jobData);
        setCandidates(candidateData);
        if (jobData.length) {
          setActiveJobId(jobData[0].id);
        }
      } catch (error) {
        setMessage(resolveError(error, "Failed to load the dashboard."));
      } finally {
        setBusy(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!activeJobId) {
      setRankings([]);
      return;
    }

    async function loadRankings() {
      setLoadingRankings(true);
      try {
        const response = await fetchRankings(activeJobId, appliedSkillFilter);
        startTransition(() => setRankings(response.rankings));
      } catch (error) {
        setMessage(resolveError(error, "Failed to load rankings."));
      } finally {
        setLoadingRankings(false);
      }
    }

    loadRankings();
  }, [activeJobId, appliedSkillFilter]);

  async function handleCreateJob(payload) {
    setBusy(true);
    try {
      const response = await uploadJob(payload);
      setJobs((currentJobs) => [response.job, ...currentJobs]);
      setActiveJobId(response.job.id);
      setMessage(`Job "${response.job.title}" saved and ready for screening.`);
      return true;
    } catch (error) {
      setMessage(resolveError(error, "Unable to upload the job description."));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleResumeUpload(files) {
    setBusy(true);
    try {
      const response = await uploadResumes(files);
      setCandidates((currentCandidates) => [
        ...response.candidates,
        ...currentCandidates,
      ]);
      setMessage(`${response.uploaded_count} resume(s) uploaded and parsed successfully.`);
      return true;
    } catch (error) {
      setMessage(resolveError(error, "Unable to upload one or more resumes."));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleProcess() {
    if (!activeJobId) {
      setMessage("Choose or create a job description before processing resumes.");
      return;
    }

    setBusy(true);
    setLoadingRankings(true);
    try {
      const payload = {
        job_id: activeJobId,
        candidate_ids: candidates.map((candidate) => candidate.id),
      };
      const response = await processResumes(payload);
      startTransition(() => setRankings(response.rankings));
      const refreshedCandidates = await fetchCandidates();
      setCandidates(refreshedCandidates);
      setMessage(
        `Processed ${response.processed_count} candidate(s) for ${activeJob?.title || "the active job"}.`
      );
      return true;
    } catch (error) {
      setMessage(resolveError(error, "Resume processing failed."));
      return false;
    } finally {
      setBusy(false);
      setLoadingRankings(false);
    }
  }

  async function handleDeleteResume(resumeId) {
    setBusy(true);
    try {
      const response = await deleteResume(resumeId);
      setCandidates((currentCandidates) =>
        currentCandidates.filter((candidate) => candidate.id !== resumeId)
      );
      startTransition(() =>
        setRankings((currentRankings) =>
          currentRankings.filter((candidate) => candidate.candidate_id !== resumeId)
        )
      );
      setMessage(response.message);
      return true;
    } catch (error) {
      setMessage(resolveError(error, "Unable to delete the selected resume."));
      return false;
    } finally {
      setBusy(false);
    }
  }

  function handleApplyFilter() {
    setAppliedSkillFilter(skillFilter.trim());
  }

  function handleResetFilter() {
    setSkillFilter("");
    setAppliedSkillFilter("");
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <header className="hero">
        <div>
          <p className="eyebrow">AI Resume Screening System</p>
          <h1>Rank applicants with explainable AI matching.</h1>
          <p className="hero-copy">
            Upload a role brief, batch-process resumes, and surface the strongest fits using
            skill overlap, experience relevance, and semantic similarity.
          </p>
        </div>

        <div className="status-card">
          <span className="status-dot" />
          <p>{message}</p>
        </div>
      </header>

      <UploadPanel
        jobs={jobs}
        activeJobId={activeJobId}
        onSelectJob={setActiveJobId}
        onCreateJob={handleCreateJob}
        onUploadResumes={handleResumeUpload}
        onProcess={handleProcess}
        busy={busy}
      />

      <SummaryCards rankings={deferredRankings} />

      <FilterBar
        skillFilter={skillFilter}
        setSkillFilter={setSkillFilter}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
        activeJob={activeJob}
      />

      <ResumeLibrary
        resumes={candidates}
        onDeleteResume={handleDeleteResume}
        busy={busy}
      />

      <CandidateTable rankings={deferredRankings} loading={loadingRankings} />
    </div>
  );
}

function resolveError(error, fallbackMessage) {
  return error?.response?.data?.detail || fallbackMessage;
}
