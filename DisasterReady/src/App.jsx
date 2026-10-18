import { useState } from 'react';

const disasters = [
  {
    id: 'earthquake',
    name: 'Earthquake',
    icon: '〰',
    description: 'Learn how to stay safe before, during, and after an earthquake.',
    color: '#E8A23A',
  },
  {
    id: 'flood',
    name: 'Flood',
    icon: '≋',
    description: 'Prepare for rising water and understand flood safety basics.',
    color: '#4287D6',
  },
  {
    id: 'fire',
    name: 'Fire',
    icon: '♨',
    description: 'Understand fire prevention, evacuation, and emergency response.',
    color: '#E36C4A',
  },
  {
    id: 'cyclone',
    name: 'Cyclone',
    icon: '🌀',
    description: 'Learn how to prepare for severe winds and storm warnings.',
    color: '#6E78D8',
  },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: '#17352b', background: '#f5f7f2' }}>
      <aside style={{ width: '220px', padding: '24px', background: '#17352b', color: 'white' }}>
        <h2>DisasterReady</h2>
        {['dashboard', 'guides', 'quiz', 'checklist', 'about'].map((page) => (
          <button
            key={page}
            onClick={() => {
              setActivePage(page);
              setSelectedDisaster(null);
            }}
            style={{ display: 'block', width: '100%', margin: '12px 0', padding: '12px', textAlign: 'left', cursor: 'pointer' }}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        {activePage === 'dashboard' ? (
          <>
            <p>LEARN TODAY. BE PREPARED TOMORROW.</p>
            <h1>Prepared people make safer communities.</h1>
            <p>Build your disaster preparedness knowledge with practical safety guides, interactive quizzes, and emergency planning.</p>
            <h2>Explore disaster guides</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))', gap: '16px' }}>
              {disasters.map((disaster) => (
                <button
                  key={disaster.id}
                  onClick={() => {
                    setSelectedDisaster(disaster);
                    setActivePage('guides');
                  }}
                  style={{ padding: '24px', textAlign: 'left', border: '1px solid #d8e1d8', borderRadius: '12px', background: 'white', cursor: 'pointer' }}
                >
                  <span style={{ color: disaster.color, fontSize: '28px' }}>{disaster.icon}</span>
                  <h3>{disaster.name}</h3>
                  <p>{disaster.description}</p>
                </button>
              ))}
            </div>
            <h2>Ready to test your knowledge?</h2>
            <button onClick={() => setActivePage('quiz')}>Take the quiz</button>{' '}
            <button onClick={() => setActivePage('checklist')}>Open emergency checklist</button>
          </>
        ) : (
          <>
            <h1>{selectedDisaster ? selectedDisaster.name : activePage === 'guides' ? 'Disaster Guides' : activePage === 'quiz' ? 'Safety Quiz' : activePage === 'checklist' ? 'Emergency Kit' : 'About DisasterReady'}</h1>
            <p>This section is coming soon.</p>
            <button onClick={() => setActivePage('dashboard')}>Back to dashboard</button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;