import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import EnhancedNavbar from '../components/EnhancedNavbar';
import FloatingAIAssistant from '../components/FloatingAIAssistant';
import { useAuth } from '../hooks/useAuth';
import { api } from '../data/api';
import type { AuditLog } from '../data/api';
import { FiUser, FiKey, FiLogOut, FiCheck, FiSearch } from 'react-icons/fi';

function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [savedKeyMsg, setSavedKeyMsg] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('garuda_gemini_api_key') || '';
    setApiKey(saved);

    api.getAuditLogs().then((data) => {
      setAuditLogs(data);
      setLoadingLogs(false);
    });
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('garuda_gemini_api_key', apiKey);
    setSavedKeyMsg(true);
    setTimeout(() => setSavedKeyMsg(false), 2500);
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.userEmail.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gridTemplateRows: '70px 1fr', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ gridColumn: 1, gridRow: '1 / -1' }}>
        <Sidebar />
      </div>

      {/* Navbar */}
      <div style={{ gridColumn: 2, gridRow: 1, zIndex: 90 }}>
        <EnhancedNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content */}
      <main
        style={{
          gridColumn: 2,
          gridRow: 2,
          overflowY: 'auto',
          padding: '24px',
          background: 'linear-gradient(-45deg, #081229, #0f1a35, #1a2847, #081229)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 20s ease infinite',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Page Header */}
        <div style={{ animation: 'slideInDown 0.5s ease-out' }}>
          <p className="eyebrow">SYSTEM CONFIGURATION & SECURITY AUDIT</p>
          <h2 style={{ marginTop: '8px' }}>Security Settings & Audit Logs</h2>
        </div>

        {/* Top Grid: Profile Card & AI Key Config */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* User Profile Card */}
          <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p className="eyebrow">ACTIVE OPERATIONAL PROFILE</p>
                <h4 style={{ marginTop: '4px', margin: 0 }}>Authenticated Duty Credentials</h4>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  background: 'rgba(0, 217, 255, 0.1)',
                  border: '1px solid var(--neon-cyan)',
                  color: 'var(--neon-cyan)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                {user?.role || 'Investigator'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(15, 26, 53, 0.4)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040a18', fontWeight: 'bold' }}>
                  <FiUser size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)' }}>{user?.name || 'Authorized Investigator'}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>{user?.email || 'investigator@garuda.ai'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ marginTop: '16px', width: '100%', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', color: '#fca5a5' }}
            >
              <FiLogOut />
              Terminate Active Session (Logout)
            </button>
          </div>

          {/* Gemini AI Key Settings */}
          <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.1s both' }}>
            <p className="eyebrow">INTELLIGENCE ENGINES</p>
            <h4 style={{ marginTop: '4px', marginBottom: '16px' }}>Gemini AI Credentials</h4>
            <form onSubmit={handleSaveApiKey} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Configure custom Google Gemini API Key for dynamic real-time case summary generation and forensic copilot answers.
              </p>
              <div style={{ position: 'relative' }}>
                <FiKey style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-quaternary)' }} />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    background: 'rgba(15, 26, 53, 0.4)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.85rem',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                {savedKeyMsg ? (
                  <>
                    <FiCheck /> Key Saved Successfully
                  </>
                ) : (
                  'Update Intelligence API Key'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Audit Trail Section */}
        <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.2s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p className="eyebrow">IMMUTABLE SYSTEM RECORD</p>
              <h3 style={{ margin: 0 }}>Zoho Catalyst Audit Logs</h3>
            </div>
            <div style={{ position: 'relative', width: '300px' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-quaternary)' }} />
              <input
                type="text"
                placeholder="Search audit actions or users..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: 'rgba(15, 26, 53, 0.4)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          {loadingLogs ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Querying Audit Store from Zoho Catalyst...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px', fontFamily: "'IBM Plex Mono', monospace" }}>LOG ID</th>
                    <th style={{ padding: '10px' }}>User Email</th>
                    <th style={{ padding: '10px' }}>Action Triggered</th>
                    <th style={{ padding: '10px' }}>Target Scope</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row-hover">
                      <td style={{ padding: '12px 10px', color: 'var(--neon-cyan)', fontFamily: "'IBM Plex Mono', monospace" }}>{log.id}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-primary)' }}>{log.userEmail}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background:
                              log.action.includes('LOGIN')
                                ? 'rgba(56, 189, 248, 0.1)'
                                : log.action.includes('ESCALATED')
                                ? 'rgba(239, 68, 68, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                            color:
                              log.action.includes('LOGIN')
                                ? '#38bdf8'
                                : log.action.includes('ESCALATED')
                                ? '#fca5a5'
                                : '#fde68a',
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{log.target}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'right', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>
                        {new Date(log.timestamp).toLocaleTimeString()} {new Date(log.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}

export default SettingsPage;
