function DisasterGuide({ disaster, onBack }) {
  if (!disaster) {
    return (
      <div>
        <h1>Disaster Guide</h1>
        <p>Select a disaster from the dashboard to learn more.</p>
        <button onClick={onBack}>Back to Dashboard</button>
      </div>
    );
  }

  const guides = {
    Earthquake: {
      before: [
        'Secure heavy furniture and objects that could fall.',
        'Prepare an emergency kit with water, food, and first-aid supplies.',
        'Identify safe places, such as under a sturdy table.',
        'Practice Drop, Cover, and Hold On.',
      ],
      during: [
        'Drop to your hands and knees.',
        'Cover your head and neck under a sturdy table if possible.',
        'Hold on until the shaking stops.',
        'Stay away from windows and glass.',
      ],
      after: [
        'Check yourself and others for injuries.',
        'Be prepared for aftershocks.',
        'Avoid damaged buildings.',
        'Follow instructions from local authorities.',
      ],
    },

    Flood: {
      before: [
        'Monitor official weather alerts and flood warnings.',
        'Identify evacuation routes and nearby higher ground.',
        'Keep important documents in a waterproof bag.',
        'Prepare drinking water, food, medicines, and a flashlight.',
      ],
      during: [
        'Move to higher ground when instructed or when flooding threatens.',
        'Never walk, swim, or drive through floodwater.',
        'Stay away from rivers, drains, and flooded roads.',
        'Follow official evacuation instructions.',
      ],
      after: [
        'Return only when authorities say it is safe.',
        'Avoid contaminated floodwater.',
        'Do not touch wet electrical equipment.',
        'Use safe drinking water and discard contaminated food.',
      ],
    },

    Fire: {
      before: [
        'Install and regularly test smoke alarms.',
        'Plan at least two escape routes from your home.',
        'Keep exits and escape routes clear.',
        'Keep matches and lighters away from children.',
      ],
      during: [
        'Raise the alarm and evacuate immediately.',
        'Stay low under smoke while escaping.',
        'Never use an elevator during a fire.',
        'If a door feels hot, use another escape route.',
        'Once outside, contact emergency services.',
      ],
      after: [
        'Stay outside and never re-enter a burning building.',
        'Seek medical help for burns or smoke inhalation.',
        'Follow instructions from firefighters.',
        'Do not reconnect damaged gas or electrical systems yourself.',
      ],
    },

    Cyclone: {
      before: [
        'Monitor official weather forecasts and cyclone warnings.',
        'Secure outdoor objects if it is safe to do so.',
        'Charge phones and prepare emergency supplies.',
        'Learn your evacuation route and identify a safe shelter.',
      ],
      during: [
        'Stay indoors and away from windows.',
        'Move to a sturdy interior room or designated shelter.',
        'Follow official evacuation instructions.',
        'Do not go outside during a temporary lull in the winds.',
        'Stay away from floodwater and fallen power lines.',
      ],
      after: [
        'Wait for official confirmation that it is safe to go outside.',
        'Avoid damaged buildings and fallen power lines.',
        'Stay away from floodwater.',
        'Use safe drinking water and follow public-health guidance.',
      ],
    },
  };

  const guide = guides[disaster.name];

  if (!guide) {
    return (
      <div>
        <h1>{disaster.name}</h1>
        <p>Safety information for this disaster is being prepared.</p>
        <button onClick={onBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack}>← Back to Dashboard</button>

      <h1>{disaster.icon} {disaster.name} Safety Guide</h1>

      <p>{disaster.description}</p>

      <section>
        <h2>Before a {disaster.name}</h2>
        <ul>
          {guide.before.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>During a {disaster.name}</h2>
        <ul>
          {guide.during.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>After a {disaster.name}</h2>
        <ul>
          {guide.after.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default DisasterGuide;
