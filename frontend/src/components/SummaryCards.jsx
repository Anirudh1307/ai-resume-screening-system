export default function SummaryCards({ rankings }) {
  const averageScore = rankings.length
    ? (rankings.reduce((total, item) => total + item.match_score, 0) / rankings.length).toFixed(1)
    : "0.0";
  const topScore = rankings.length ? rankings[0].match_score.toFixed(1) : "0.0";
  const skillRichCandidates = rankings.filter((item) => item.matched_skills.length >= 3).length;

  const cards = [
    { label: "Candidates Ranked", value: rankings.length },
    { label: "Average Match Score", value: averageScore },
    { label: "Top Match Score", value: topScore },
    { label: "Strong Skill Overlap", value: skillRichCandidates },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
