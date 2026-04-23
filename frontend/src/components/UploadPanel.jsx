import { useState } from "react";

export default function UploadPanel({
  jobs,
  activeJobId,
  onSelectJob,
  onCreateJob,
  onUploadResumes,
  onProcess,
  busy,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobFile, setJobFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);

  async function handleJobSubmit(event) {
    event.preventDefault();
    const success = await onCreateJob({ title, description, file: jobFile });
    if (success) {
      setTitle("");
      setDescription("");
      setJobFile(null);
      event.target.reset();
    }
  }

  async function handleResumeSubmit(event) {
    event.preventDefault();
    if (!resumeFiles.length) {
      return;
    }
    const success = await onUploadResumes(resumeFiles);
    if (success) {
      setResumeFiles([]);
      event.target.reset();
    }
  }

  return (
    <section className="panel stack-lg">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Pipeline Control</p>
          <h2>Screen candidates against a live job profile</h2>
        </div>
        <div className="job-select">
          <label htmlFor="job-selector">Active job</label>
          <select
            id="job-selector"
            value={activeJobId || ""}
            onChange={(event) => onSelectJob(Number(event.target.value) || null)}
          >
            <option value="">Choose a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-two">
        <form className="form-card" onSubmit={handleJobSubmit}>
          <div className="card-title">
            <h3>Upload Job Description</h3>
            <p>Paste the role brief or attach a PDF/TXT document.</p>
          </div>

          <label>
            Job title
            <input
              required
              type="text"
              placeholder="Senior Python Developer"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            Description
            <textarea
              rows="8"
              placeholder="Describe responsibilities, required skills, and experience expectations."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label>
            Optional job file
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(event) => setJobFile(event.target.files?.[0] || null)}
            />
          </label>

          <button className="primary-button" type="submit" disabled={busy}>
            Save job description
          </button>
        </form>

        <form className="form-card" onSubmit={handleResumeSubmit}>
          <div className="card-title">
            <h3>Upload Resumes</h3>
            <p>Drop in one or many PDF resumes for batch screening.</p>
          </div>

          <label>
            Resume PDFs
            <input
              required
              type="file"
              multiple
              accept=".pdf"
              onChange={(event) => setResumeFiles(Array.from(event.target.files || []))}
            />
          </label>

          <div className="helper-card">
            <span>{resumeFiles.length} file(s) ready</span>
            <span>FastAPI will extract and parse each resume automatically.</span>
          </div>

          <button className="secondary-button" type="submit" disabled={busy}>
            Upload resumes
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={onProcess}
            disabled={busy || !activeJobId}
          >
            Process and rank candidates
          </button>
        </form>
      </div>
    </section>
  );
}
