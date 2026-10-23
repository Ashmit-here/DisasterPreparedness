// Safety advice is grouped by the three moments when a person needs it.
const guideContent = {
  Earthquake: {
    before: ['Secure heavy furniture.', 'Prepare water, food, medicine, and a first-aid kit.', 'Identify safe places away from glass.', 'Practise Drop, Cover, and Hold On.'],
    during: ['Drop to your hands and knees.', 'Cover your head and neck under sturdy furniture.', 'Hold on until shaking stops.', 'Stay away from windows and tall furniture.'],
    after: ['Check for injuries.', 'Expect aftershocks.', 'Avoid damaged buildings and downed lines.', 'Follow local authorities.'],
  },
  Flood: {
    before: ['Monitor official warnings.', 'Know your evacuation route and higher ground.', 'Protect documents in a waterproof bag.', 'Prepare water, food, medicine, and a flashlight.'],
    during: ['Move to higher ground.', 'Never walk, swim, or drive through floodwater.', 'Keep away from rivers, drains, and flooded roads.', 'Follow evacuation instructions.'],
    after: ['Return only when it is safe.', 'Avoid contaminated floodwater.', 'Do not touch wet electrical equipment.', 'Use safe water and discard contaminated food.'],
  },
  Fire: {
    before: ['Test smoke alarms.', 'Plan two escape routes.', 'Keep exits clear.', 'Keep matches and lighters away from children.'],
    during: ['Raise the alarm and leave immediately.', 'Stay low under smoke.', 'Never use an elevator.', 'Use another route if a door feels hot.'],
    after: ['Never re-enter the building.', 'Get medical help for burns or smoke inhalation.', 'Follow firefighters’ instructions.', 'Do not reconnect damaged utilities yourself.'],
  },
  Cyclone: {
    before: ['Monitor official forecasts.', 'Secure outdoor objects when safe.', 'Charge phones and prepare supplies.', 'Know your evacuation route and shelter.'],
    during: ['Stay indoors and away from windows.', 'Move to an interior room or shelter.', 'Follow evacuation instructions.', 'Do not go outside during a lull in the wind.'],
    after: ['Wait for official confirmation.', 'Avoid damaged buildings and power lines.', 'Stay away from floodwater.', 'Use safe water and follow health guidance.'],
  },
};

// Show this list when the learner has not chosen a disaster yet.
function GuidePicker({ disasters, onSelect }) {
  return (
    <section className="content-page">
      <span className="eyebrow">SAFETY GUIDES</span>
      <h1>Know what to do, before it matters.</h1>
      <p className="page-lead">Choose a hazard to see practical actions for before, during, and after an emergency.</p>
      <div className="guide-picker">
        {disasters.map((disaster) => (
          <button className="guide-picker-card" key={disaster.id} onClick={() => onSelect(disaster)}>
            <span>{disaster.icon}</span>
            <div><h2>{disaster.name}</h2><p>{disaster.description}</p></div>
            <b>→</b>
          </button>
        ))}
      </div>
    </section>
  );
}

function DisasterGuide({ disaster, disasters, onBack, onSelect }) {
  // No selected disaster means the user is browsing all available guides.
  if (!disaster) return <GuidePicker disasters={disasters} onSelect={onSelect} />;

  const guide = guideContent[disaster.name];
  const phases = [
    ['Before', 'Prepare early', guide.before],
    ['During', 'Protect yourself', guide.during],
    ['After', 'Recover safely', guide.after],
  ];

  return (
    <section className="content-page guide-page">
      <button className="back-button" onClick={onBack}>← Back to dashboard</button>

      {/* Guide heading and a short reminder. */}
      <header className="guide-hero">
        <span className="guide-icon">{disaster.icon}</span>
        <div><span className="eyebrow">SAFETY GUIDE</span><h1>{disaster.name} readiness</h1><p>{disaster.description}</p></div>
      </header>
      <aside className="guide-alert"><strong>Remember:</strong> Conditions can change quickly. Follow official alerts and local authorities.</aside>

      {/* Reusable cards for before, during, and after actions. */}
      <div className="guide-steps">
        {phases.map(([phase, subtitle, tips]) => (
          <section className="guide-phase" key={phase}>
            <span className="phase-label">{phase.toUpperCase()}</span>
            <h2>{subtitle}</h2>
            <ul>{tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          </section>
        ))}
      </div>
    </section>
  );
}

export default DisasterGuide;
