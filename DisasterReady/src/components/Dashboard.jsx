import DisasterCard from './DisasterCard';

function Dashboard({ disasters, onSelectDisaster, onNavigate }) {
  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="topbar-badge">
          <span>●</span> Learning mode
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">BE INFORMED. BE PREPARED.</span>
          <h2>
            Prepared people
            <br />
            make safer communities.
          </h2>
          <p>
            Build your disaster preparedness knowledge with practical
            safety guides, interactive quizzes, and emergency planning.
          </p>
          <button
            className="primary-button"
            onClick={() => onNavigate('guides')}
          >
            Explore safety guides <span>→</span>
          </button>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-circle">
            <span>✚</span>
          </div>
          <div className="hero-caption">SAFETY FIRST</div>
        </div>
      </section>

      <section className="disaster-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LEARN &amp; PREPARE</span>
            <h2>Explore disaster guides</h2>
          </div>
          <span className="section-count">{disasters.length} TOPICS</span>
        </div>

        <div className="disaster-grid">
          {disasters.map((disaster) => (
            <DisasterCard
              key={disaster.id}
              disaster={disaster}
              onSelect={onSelectDisaster}
            />
          ))}
        </div>
      </section>

      <section className="bottom-grid">
        <article className="info-panel">
          <div className="panel-icon">✓</div>
          <div>
            <span className="eyebrow">TEST YOUR KNOWLEDGE</span>
            <h3>How prepared are you?</h3>
            <p>Check what you've learned with a quick safety quiz.</p>
            <button
              className="text-button"
              onClick={() => onNavigate('quiz')}
            >
              Take the quiz →
            </button>
          </div>
        </article>

        <article className="info-panel">
          <div className="panel-icon kit-icon">☷</div>
          <div>
            <span className="eyebrow">PLAN AHEAD</span>
            <h3>Build your emergency kit</h3>
            <p>Keep essential supplies organized and ready.</p>
            <button
              className="text-button"
              onClick={() => onNavigate('checklist')}
            >
              Open checklist →
            </button>
          </div>
        </article>
      </section>

      <footer className="dashboard-footer">
        Educational resource • Always follow official emergency instructions.
      </footer>
    </main>
  );
}

export default Dashboard;