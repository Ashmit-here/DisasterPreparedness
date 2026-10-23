const guideContent = {
  Earthquake: { before: ['Secure heavy furniture and objects that could fall.', 'Prepare water, food, medicines, a flashlight, and first-aid supplies.', 'Identify safe places under sturdy furniture and away from glass.', 'Practise Drop, Cover, and Hold On with your household.'], during: ['Drop to your hands and knees.', 'Cover your head and neck under sturdy furniture if possible.', 'Hold on until the shaking stops.', 'Stay away from windows, glass, and tall furniture.'], after: ['Check yourself and others for injuries.', 'Expect aftershocks and be ready to Drop, Cover, and Hold On again.', 'Avoid damaged buildings and downed utility lines.', 'Follow instructions from local authorities.'] },
  Flood: { before: ['Monitor official weather alerts and flood warnings.', 'Know your evacuation route and nearby higher ground.', 'Protect documents in a waterproof bag.', 'Prepare drinking water, food, medicines, and a flashlight.'], during: ['Move to higher ground when flooding threatens.', 'Never walk, swim, or drive through floodwater.', 'Keep away from rivers, drains, and flooded roads.', 'Follow official evacuation instructions immediately.'], after: ['Return only when authorities say it is safe.', 'Avoid contaminated floodwater and damaged areas.', 'Do not touch wet electrical equipment.', 'Use safe drinking water and discard contaminated food.'] },
  Fire: { before: ['Install and test smoke alarms regularly.', 'Plan two escape routes from every room.', 'Keep exits and escape routes clear.', 'Keep matches and lighters away from children.'], during: ['Raise the alarm and evacuate immediately.', 'Stay low under smoke while escaping.', 'Never use an elevator during a fire.', 'If a door feels hot, use another escape route.'], after: ['Stay outside and never re-enter a burning building.', 'Seek medical help for burns or smoke inhalation.', 'Follow instructions from firefighters.', 'Do not reconnect damaged gas or electrical systems yourself.'] },
  Cyclone: { before: ['Monitor official forecasts and cyclone warnings.', 'Secure outdoor objects if it is safe to do so.', 'Charge phones and prepare emergency supplies.', 'Know your evacuation route and a safe shelter.'], during: ['Stay indoors and away from windows.', 'Move to a sturdy interior room or designated shelter.', 'Follow official evacuation instructions.', 'Do not go outside during a temporary lull in the winds.'], after: ['Wait for official confirmation before going outside.', 'Avoid damaged buildings and fallen power lines.', 'Stay away from floodwater.', 'Use safe drinking water and follow public-health guidance.'] },
};

function GuidePicker({ disasters, onSelect }) {
  return <section className="content-page"><span className="eyebrow">SAFETY GUIDES</span><h1>Know what to do, before it matters.</h1><p className="page-lead">Choose a hazard to see practical actions for before, during, and after an emergency.</p><div className="guide-picker">{disasters.map((disaster) => <button key={disaster.id} className="guide-picker-card" onClick={() => onSelect(disaster)}><span>{disaster.icon}</span><div><h2>{disaster.name}</h2><p>{disaster.description}</p></div><b>→</b></button>)}</div></section>;
}

function DisasterGuide({ disaster, disasters, onBack, onSelect }) {
  if (!disaster) return <GuidePicker disasters={disasters} onSelect={onSelect} />;
  const guide = guideContent[disaster.name];
  return <section className="content-page guide-page">
    <button className="back-button" onClick={onBack}>← Back to dashboard</button>
    <header className="guide-hero"><span className="guide-icon">{disaster.icon}</span><div><span className="eyebrow">SAFETY GUIDE</span><h1>{disaster.name} readiness</h1><p>{disaster.description}</p></div></header>
    <aside className="guide-alert"><strong>Remember:</strong> Conditions can change quickly. Follow official alerts and directions from local authorities.</aside>
    <div className="guide-steps">{[['Before', 'Prepare early', guide.before], ['During', 'Protect yourself', guide.during], ['After', 'Recover safely', guide.after]].map(([phase, subtitle, tips]) => <section className="guide-phase" key={phase}><span className="phase-label">{phase.toUpperCase()}</span><h2>{subtitle}</h2><ul>{tips.map((tip) => <li key={tip}>{tip}</li>)}</ul></section>)}</div>
  </section>;
}

export default DisasterGuide;
