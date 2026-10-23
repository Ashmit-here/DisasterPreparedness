// Navigation labels are kept in one list so adding a page is easy.
const navigationItems = [
  { id: 'dashboard', icon: '⌂', label: 'Dashboard' },
  { id: 'guides', icon: '▤', label: 'Disaster Guides' },
  { id: 'quiz', icon: '✓', label: 'Safety Quiz' },
  { id: 'checklist', icon: '☷', label: 'Emergency Kit' },
  { id: 'about', icon: 'ⓘ', label: 'About' },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      {/* App name and short description. */}
      <div className="brand">
        <span className="brand-mark">✚</span>
        <div>
          <strong>DisasterReady</strong>
          <span>Preparedness starts here</span>
        </div>
      </div>

      {/* Main page links. The active page receives a different style. */}
      <p className="nav-heading">WORKSPACE</p>
      <nav className="navigation" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* A small status message at the bottom of larger screens. */}
      <div className="sidebar-footer">
        <div className="status-dot" />
        <div>
          <strong>Ready to learn</strong>
          <span>Safety through knowledge</span>
          <span>Created by : Asmit (with a lil' help form ai 😅)</span>
          <span>Version: 1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
