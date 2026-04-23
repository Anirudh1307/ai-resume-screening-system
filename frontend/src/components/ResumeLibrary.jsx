import { useState } from "react";

import { getResumeDownloadUrl } from "../api/client";

export default function ResumeLibrary({ resumes, onDeleteResume, busy }) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(resumeId) {
    setDeletingId(resumeId);
    try {
      await onDeleteResume(resumeId);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="panel">
      <div className="table-head">
        <div>
          <p className="eyebrow">View Resumes</p>
          <h2>Uploaded resume library</h2>
        </div>
      </div>

      {!resumes.length ? (
        <div className="empty-state">No resumes uploaded yet.</div>
      ) : (
        <div className="resume-list">
          {resumes.map((resume) => (
            <article key={resume.id} className="resume-card">
              <div className="resume-card-top">
                <div>
                  <h3>{resume.filename}</h3>
                  <p>
                    Score: {resume.score != null ? resume.score.toFixed(1) : "Not ranked yet"}
                  </p>
                </div>
                <div className="resume-actions">
                  <a
                    className="ghost-button resume-link"
                    href={getResumeDownloadUrl(resume.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                  <button
                    className="danger-button"
                    type="button"
                    disabled={busy || deletingId === resume.id}
                    onClick={() => handleDelete(resume.id)}
                  >
                    {deletingId === resume.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="detail-block">
                <span className="detail-title">Extracted skills</span>
                <div className="chip-wrap">
                  {resume.skills?.length ? (
                    resume.skills.map((skill) => (
                      <span key={`${resume.id}-${skill}`} className="chip">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="muted-text">No skills extracted yet.</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
