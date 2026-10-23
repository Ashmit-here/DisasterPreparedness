import { useState } from 'react';
import Checklist from './components/Checklist';
import Dashboard from './components/Dashboard';
import DisasterGuide from './components/DisasterGuide';
import Quiz from './components/Quiz';
import Sidebar from './components/Sidebar';
import { disasters } from './data/disaster';

function About({ onNavigate }) {
  return (
    <section className="content-page about-page">
      <span className="eyebrow">ABOUT DISASTERREADY</span>
      <h1>Practical knowledge for safer decisions.</h1>
      <p className="page-lead">DisasterReady is a learning companion for building everyday emergency preparedness skills. It turns essential safety guidance into clear, easy-to-review actions.</p>
      <div className="about-grid">
        <article className="about-card"><span className="about-icon">◈</span><h2>Learn</h2><p>Review simple before, during, and after actions for common hazards.</p></article>
        <article className="about-card"><span className="about-icon">✓</span><h2>Practice</h2><p>Use the safety quiz to check your understanding and track progress.</p></article>
        <article className="about-card"><span className="about-icon">☷</span><h2>Prepare</h2><p>Build a practical emergency kit checklist before an emergency occurs.</p></article>
      </div>
      <section className="callout">
        <div><span className="eyebrow">IMPORTANT</span><h2>Always follow official instructions.</h2><p>This app supports learning and planning. During an emergency, rely on local authorities, emergency services, and official alerts for the most current instructions.</p></div>
        <button className="primary-button" onClick={() => onNavigate('guides')}>Explore safety guides <span>→</span></button>
      </section>
      <section className="about-note"><h2>Built for everyday readiness</h2><p>Preparedness is not about predicting every event. It is about knowing where to find reliable information, discussing a plan with the people around you, and keeping basic supplies ready.</p></section>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const navigate = (page) => { setActivePage(page); if (page !== 'guides') setSelectedDisaster(null); };
  const openDisasterGuide = (disaster) => { setSelectedDisaster(disaster); setActivePage('guides'); };

  return <div className="app-shell">
    <Sidebar activePage={activePage} onNavigate={navigate} />
    <main className="main-content">
      {activePage === 'dashboard' && <Dashboard disasters={disasters} onSelectDisaster={openDisasterGuide} onNavigate={navigate} />}
      {activePage === 'guides' && <DisasterGuide disaster={selectedDisaster} disasters={disasters} onBack={() => navigate('dashboard')} onSelect={openDisasterGuide} />}
      {activePage === 'quiz' && <Quiz />}
      {activePage === 'checklist' && <Checklist />}
      {activePage === 'about' && <About onNavigate={navigate} />}
    </main>
  </div>;
}

export default App;
