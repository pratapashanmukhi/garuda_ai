import { useEffect, useState } from 'react';
import { FiSearch, FiBell, FiUser, FiMoon, FiSun, FiMenu } from 'react-icons/fi';

interface EnhancedNavbarProps {
  onMenuToggle?: () => void;
  isDarkMode?: boolean;
  onDarkModeChange?: (isDark: boolean) => void;
}

function EnhancedNavbar({ onMenuToggle, isDarkMode = true, onDarkModeChange }: EnhancedNavbarProps) {
  const [time, setTime] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar" style={{ display: 'flex', gap: '16px', padding: '12px 24px', height: '70px', alignItems: 'center' }}>
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <button className="btn-icon" onClick={onMenuToggle} title="Toggle sidebar">
          <FiMenu size={18} />
        </button>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            maxWidth: '300px',
            transition: 'all var(--transition-base)',
          }}
        >
          <FiSearch
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search transactions, accounts..."
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
            style={{
              width: '100%',
              paddingLeft: '36px',
              background: isSearching
                ? 'rgba(15, 26, 53, 0.7)'
                : 'rgba(15, 26, 53, 0.4)',
              border: isSearching
                ? '1.5px solid var(--neon-cyan-light)'
                : '1px solid var(--border-secondary)',
            }}
          />
        </div>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Notifications */}
        <button className="btn-icon" title="Notifications" style={{ position: 'relative' }}>
          <FiBell size={18} />
          {notifications > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--neon-red)',
                color: 'white',
                fontSize: '0.65rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              {notifications}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="btn-icon"
          onClick={() => onDarkModeChange?.(!isDarkMode)}
          title="Toggle dark mode"
        >
          {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Real-time Clock */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.85rem',
            color: 'var(--neon-cyan)',
            fontWeight: 600,
            minWidth: '60px',
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}
        >
          {time}
        </div>

        {/* Profile */}
        <button className="btn-icon" title="Profile">
          <FiUser size={18} />
        </button>
      </div>
    </nav>
  );
}

export default EnhancedNavbar;
