import { useState } from 'react';
import Checklist from './components/Checklist';
import Dashboard from './components/Dashboard';
import DisasterGuide from './components/DisasterGuide';
import Quiz from './components/Quiz';
import Sidebar from './components/Sidebar';
import { disasters } from './data/disaster';

// The About page explains what the app is for and where its advice comes from.
function About({ onNavigate }) {
  const features = [
    ['◈', 'Learn', 'Review simple before, during, and after actions for common hazards.'],
    ['✓', 'Practice', 'Use the safety quiz to check your understanding and track progress.'],
    ['☷', 'Prepare', 'Build a practical emergency kit checklist before an emergency occurs.'],
  ];

  return (
    <section className="content-page about-page">
      <span className="eyebrow">ABOUT DISASTERREADY</span>
      <h1>Practical knowledge for safer decisions.</h1>
      <p className="page-lead">
        DisasterReady is a learning companion for building everyday emergency
        preparedness skills. It turns essential safety guidance into clear,
        easy-to-review actions.
      </p>

      {/* Three main ways the app helps the learner. */}
      <div className="about-grid">
        {features.map(([icon, title, description]) => (
          <article className="about-card" key={title}>
            <span className="about-icon">{icon}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>

      {/* Safety reminder: official instructions always come first. */}
      <section className="callout">
        <div>
          <span className="eyebrow">IMPORTANT</span>
          <h2>Always follow official instructions.</h2>
          <p>
            This app supports learning and planning. During an emergency, rely
            on local authorities, emergency services, and official alerts.
          </p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('guides')}>
          Explore safety guides <span>→</span>
        </button>
      </section>

      <section className="about-note">
        <h2>Built for everyday readiness</h2>
        <p>
          Preparedness is about knowing where to find reliable information,
          discussing a plan, and keeping basic supplies ready.
        </p>
      </section>
    </section>
  );
}

function App() {
  // These two values decide which page and which guide are on screen.
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  // Move to a page. A guide selection is only needed on the Guides page.
  const navigate = (page) => {
    setActivePage(page);
    if (page !== 'guides') setSelectedDisaster(null);
  };

  // Open one guide from a dashboard or guide-list card.
  const openGuide = (disaster) => {
    setSelectedDisaster(disaster);
    setActivePage('guides');
  };

  // Render one page at a time inside the shared app layout.
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <main className="main-content">
        {activePage === 'dashboard' && (
          <Dashboard
            disasters={disasters}
            onSelectDisaster={openGuide}
            onNavigate={navigate}
          />
        )}
        {activePage === 'guides' && (
          <DisasterGuide
            disaster={selectedDisaster}
            disasters={disasters}
            onBack={() => navigate('dashboard')}
            onSelect={openGuide}
          />
        )}
        {activePage === 'quiz' && <Quiz />}
        {activePage === 'checklist' && <Checklist />}
        {activePage === 'about' && <About onNavigate={navigate} />}
      </main>
    </div>
  );
}

export default App;
