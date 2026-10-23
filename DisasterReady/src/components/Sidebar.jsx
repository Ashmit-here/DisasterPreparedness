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
  <div className="brand">
    <span className="brand-mark">✚</span>
    <div><strong>DisasterReady</strong><span>Preparedness starts here</span></div>
  </div>
  <p className="nav-heading">WORKSPACE</p>
  <nav className="navigation">
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
  <div className="sidebar-footer">
    <div className="status-dot" />
    <div>
      <strong>Ready to learn</strong>
      <span>Safety through knowledge</span>
    </div>
  </div>
</aside>

);
}

export default Sidebar;
