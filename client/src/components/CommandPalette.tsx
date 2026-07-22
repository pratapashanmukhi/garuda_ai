import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiCreditCard, FiUser, FiArrowRight, FiShield, FiBarChart2, FiGitBranch, FiFileText } from 'react-icons/fi';
import { api } from '../data/api';
import type { FraudCase, Transaction, Account } from '../data/mockData';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

  // Global keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Load data on open
  useEffect(() => {
    if (isOpen && cases.length === 0) {
      Promise.all([api.getCases(), api.getTransactions(), api.getAccounts()]).then(
        ([c, t, a]) => {
          setCases(c);
          setTransactions(t);
          setAccounts(a);
        }
      );
    }
  }, [isOpen, cases.length]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation items
  const navShortcuts = [
    { label: 'Dashboard Command Center', icon: FiBarChart2, path: '/dashboard' },
    { label: 'Transaction Explorer', icon: FiCreditCard, path: '/transactions' },
    { label: 'Fraud Case Workspace', icon: FiShield, path: '/fraud-analysis' },
    { label: 'Entity Network Graph', icon: FiGitBranch, path: '/network' },
    { label: 'AI Forensic Reports', icon: FiFileText, path: '/reports' },
  ].filter((item) => item.label.toLowerCase().includes(q));

  // Filtered Cases
  const matchedCases = cases.filter(
    (c) => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
  );

  // Filtered Transactions
  const matchedTxs = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(q) ||
      t.sender.toLowerCase().includes(q) ||
      t.receiver.toLowerCase().includes(q)
  );

  // Filtered Accounts
  const matchedAccs = accounts.filter(
    (a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.bank.toLowerCase().includes(q)
  );

  const handleSelectPath = (path: string, state?: any) => {
    setIsOpen(false);
    setQuery('');
    navigate(path, { state });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(4, 10, 24, 0.8)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#091229',
          border: '1.5px solid var(--neon-cyan)',
          borderRadius: '12px',
          boxShadow: '0 0 40px rgba(0, 217, 255, 0.25)',
          overflow: 'hidden',
          animation: 'slideInDown 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', gap: '12px' }}>
          <FiSearch size={20} style={{ color: 'var(--neon-cyan)' }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, Case ID, Account (ACC-5421), or UTR..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>
            ESC to close
          </span>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px 16px' }}>
          {/* Quick Navigation Section */}
          {navShortcuts.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>QUICK PLATFORM NAVIGATION</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navShortcuts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.path}
                      onClick={() => handleSelectPath(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.02)',
                      }}
                      className="table-row-hover"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
                        <Icon style={{ color: 'var(--neon-cyan)' }} />
                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                      </div>
                      <FiArrowRight style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cases Results */}
          {matchedCases.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>INVESTIGATION CASES ({matchedCases.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {matchedCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectPath('/fraud-analysis', { caseId: c.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                    className="table-row-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiBriefcase style={{ color: 'var(--neon-yellow)' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>{c.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>{c.id} • ${c.totalAmount.toLocaleString()} USD</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', textTransform: 'uppercase' }}>
                      {c.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Results */}
          {matchedAccs.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>ACCOUNTS & BENEFICIARIES ({matchedAccs.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {matchedAccs.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectPath('/network', { accountId: acc.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                    className="table-row-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiUser style={{ color: 'var(--neon-cyan)' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>{acc.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>{acc.id} • {acc.bank} ({acc.country})</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>View Linkage Graph →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Results */}
          {matchedTxs.length > 0 && (
            <div>
              <p className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>FINANCIAL TRANSACTIONS ({matchedTxs.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {matchedTxs.slice(0, 4).map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => handleSelectPath('/transactions', { search: tx.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                    className="table-row-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiCreditCard style={{ color: 'var(--neon-green)' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>{tx.id}: {tx.sender} → {tx.receiver}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>${tx.amount.toLocaleString()} {tx.currency}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neon-green)' }}>Inspect Payment →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
