function DisasterCard({ disaster, onSelect }) {
  return (
    // Each card sends the selected disaster back to the parent page.
    <button
      className="disaster-card"
      onClick={() => onSelect(disaster)}
      style={{ "--card-color": disaster.color }}
    >
      <div className="disaster-card-top">
        <div className="disaster-card-icon">
          {disaster.icon}
        </div>

        <span className="disaster-card-arrow">↗</span>
      </div>

      <div className="disaster-card-content">
        <h3>{disaster.name}</h3>
        <p>{disaster.description}</p>
      </div>

      <div className="disaster-card-footer">
        <span>Explore guide</span>
        <span>→</span>
      </div>
    </button>
  );
}

export default DisasterCard;
