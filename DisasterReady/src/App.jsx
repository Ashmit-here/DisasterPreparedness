import { useState } from 'react';
import DisasterGuide from './components/DisasterGuide';
import Checklist from './components/Checklist';
import Quiz from './components/Quiz';

const disasters = [
  {
    id: 1,
    name: 'Earthquake',
    icon: '🌎',
    description: 'Learn how to protect yourself before, during, and after an earthquake.',
    color: 'earthquake',
  },
  {
    id: 2,
    name: 'Flood',
    icon: '🌊',
    description: 'Understand flood warnings, evacuation, and water safety.',
    color: 'flood',
  },
  {
    id: 3,
    name: 'Fire',
    icon: '🔥',
    description: 'Learn fire prevention, evacuation procedures, and safe escape routes.',
    color: 'fire',
  },
  {
    id: 4,
    name: 'Cyclone',
    icon: '🌀',
    description: 'Prepare for severe winds, heavy rainfall, and evacuation alerts.',
    color: 'cyclone',
  },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  const openDisasterGuide = (disaster) => {
    setSelectedDisaster(disaster);
    setActivePage('guides');
  };

  const goToDashboard = () => {
    setSelectedDisaster(null);
    setActivePage('dashboard');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: '#17352b',
        background: '#f5f7f2',
      }}
    >
      <aside
        style={{
          width: '220px',
          padding: '24px',
          background: '#17352b',
          color: 'white',
        }}
      >
        <h2>DisasterReady</h2>

        {['dashboard', 'guides', 'quiz', 'checklist', 'about'].map((page) => (
          <button
            key={page}
            onClick={() => {
              setActivePage(page);

              if (page !== 'guides') {
                setSelectedDisaster(null);
              }
            }}
            style={{
              display: 'block',
              width: '100%',
              margin: '12px 0',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        {activePage === 'dashboard' && (
          <>
            <p>LEARN TODAY. BE PREPARED TOMORROW.</p>

            <h1>Prepared people make safer communities.</h1>

            <p>
              Build your disaster preparedness knowledge with practical safety
              guides, interactive quizzes, and emergency planning.
            </p>

            <h2>Explore disaster guides</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {disasters.map((disaster) => (
                <button
                  key={disaster.id}
                  onClick={() => openDisasterGuide(disaster)}
                  style={{
                    padding: '24px',
                    textAlign: 'left',
                    border: '1px solid #d8e1d8',
                    borderRadius: '12px',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{disaster.icon}</span>

                  <h3>{disaster.name}</h3>

                  <p>{disaster.description}</p>

                  <span>Explore guide →</span>
                </button>
              ))}
            </div>

            <h2>Ready to test your knowledge?</h2>

            <button onClick={() => setActivePage('quiz')}>
              Take the quiz
            </button>

            {' '}

            <button onClick={() => setActivePage('checklist')}>
              Open emergency checklist
            </button>
          </>
        )}

        {activePage === 'guides' && (
          <DisasterGuide
            disaster={selectedDisaster}
            onBack={goToDashboard}
          />
        )}

        {activePage === 'quiz' && <Quiz />}

        {activePage === 'checklist' && <Checklist />}

        {activePage === 'about' && (
          <>
            <h1>About DisasterReady</h1>
            <p>
              DisasterReady helps students learn essential disaster
              preparedness and emergency safety practices.
            </p>
            <button onClick={goToDashboard}>Back to Dashboard</button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;