export default function FilterBar({
  skillFilter,
  setSkillFilter,
  onApplyFilter,
  onResetFilter,
  activeJob,
}) {
  return (
    <section className="panel filter-panel">
      <div>
        <p className="eyebrow">Ranking Filters</p>
        <h2>{activeJob ? activeJob.title : "Choose a job to view rankings"}</h2>
      </div>

      <div className="filter-controls">
        <input
          type="text"
          value={skillFilter}
          placeholder="Filter by skill, e.g. python"
          onChange={(event) => setSkillFilter(event.target.value)}
        />
        <button className="secondary-button" type="button" onClick={onApplyFilter}>
          Apply
        </button>
        <button className="ghost-button" type="button" onClick={onResetFilter}>
          Reset
        </button>
      </div>
    </section>
  );
}
