import { NavLink } from 'react-router-dom';
import {
  FiBarChart2,
  FiCreditCard,
  FiShield,
  FiGitBranch,
  FiFileText,
  FiSettings,
  FiZap,
} from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', icon: FiBarChart2, to: '/dashboard' },
  { label: 'Transactions', icon: FiCreditCard, to: '/transactions' },
  { label: 'Fraud Detection', icon: FiShield, to: '/fraud-analysis' },
  { label: 'Network Graph', icon: FiGitBranch, to: '/network' },
  { label: 'Reports', icon: FiFileText, to: '/reports' },
  { label: 'Settings', icon: FiSettings, to: '/settings' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-icon">
          <FiZap />
        </div>
        <div>
          <h3>GARUDA AI</h3>
          <p>Fraud Ops Console</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Threat posture</p>
        <strong>Elevated</strong>
        <span>12 active anomalies monitored</span>
      </div>
    </aside>
  );
}

export default Sidebar;
