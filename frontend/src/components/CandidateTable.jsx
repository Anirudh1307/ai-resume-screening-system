function ScoreBar({ value }) {
  return (
    <div className="score-wrap">
      <div className="score-bar">
        <span style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <strong>{value.toFixed(1)}</strong>
    </div>
  );
}

export default function CandidateTable({ rankings, loading }) {
  if (loading) {
    return <section className="panel empty-state">Processing resumes and refreshing rankings...</section>;
  }

  if (!rankings.length) {
    return (
      <section className="panel empty-state">
        Upload a job and resumes, then run processing to see ranked candidates.
      </section>
    );
  }

  return (
    <section className="panel table-panel">
      <div className="table-head">
        <div>
          <p className="eyebrow">Ranked Candidates</p>
          <h2>Shortlist with transparent scoring</h2>
        </div>
      </div>

      <div className="candidate-grid">
        {rankings.map((candidate, index) => (
          <article key={candidate.candidate_id} className="candidate-card">
            <div className="candidate-top">
              <div>
                <span className="rank-badge">#{index + 1}</span>
                <h3>{candidate.candidate_name || candidate.filename}</h3>
                <p>{candidate.email || "Email not detected"}</p>
              </div>
              <div className="score-pill">{candidate.match_score.toFixed(1)}</div>
            </div>

            <div className="metrics-grid">
              <div>
                <span>Skill match</span>
                <ScoreBar value={candidate.skill_score} />
              </div>
              <div>
                <span>Experience</span>
                <ScoreBar value={candidate.experience_score} />
              </div>
              <div>
                <span>Semantic fit</span>
                <ScoreBar value={candidate.semantic_score} />
              </div>
            </div>

            <div className="detail-block">
              <span className="detail-title">Matched skills</span>
              <div className="chip-wrap">
                {candidate.matched_skills.length ? (
                  candidate.matched_skills.map((skill) => (
                    <span key={skill} className="chip chip-positive">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="muted-text">No matching skills extracted.</span>
                )}
              </div>
            </div>

            <div className="detail-block">
              <span className="detail-title">Candidate skill set</span>
              <div className="chip-wrap">
                {candidate.skills.map((skill) => (
                  <span key={`${candidate.candidate_id}-${skill}`} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-block">
              <span className="detail-title">Why this candidate ranked here</span>
              <ul className="explanation-list">
                {candidate.explanation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="meta-row">
              <span>{candidate.experience_years.toFixed(1)} years experience</span>
              <span>{candidate.phone || "Phone not detected"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
