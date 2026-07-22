import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedRiskMeter from '../components/EnhancedRiskMeter';
import FloatingAIAssistant from '../components/FloatingAIAssistant';
import Sec91NoticeModal from '../components/Sec91NoticeModal';
import EmergencyFreezeModal from '../components/EmergencyFreezeModal';
import type { Transaction, Account, FraudCase } from '../data/mockData';
import { api } from '../data/api';
import { useAuth } from '../hooks/useAuth';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiTarget,
  FiTrendingUp,
  FiBriefcase,
  FiUser,
  FiClock,
  FiFileText,
  FiLock,
  FiShield,
} from 'react-icons/fi';

function EnhancedFraudAnalysisPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSec91, setShowSec91] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // RBAC Privileges
  const canEditNotes = user ? ['Administrator', 'Investigator', 'Senior Investigator'].includes(user.role) : false;
  const canEscalate = user ? ['Administrator', 'Senior Investigator'].includes(user.role) : false;

  const handleStatusChange = (status: 'open' | 'investigating' | 'escalated' | 'resolved') => {
    if (!selectedCase) return;
    api.escalateCase(selectedCase.id, status).then(() => {
      setCases((prev) =>
        prev.map((c) => (c.id === selectedCase.id ? { ...c, status } : c))
      );
      setSelectedCase({ ...selectedCase, status });
    });
  };

  // Load cases, transactions, and accounts
  useEffect(() => {
    Promise.all([api.getCases(), api.getTransactions(), api.getAccounts()]).then(
      ([casesData, txData, accData]) => {
        setCases(casesData);
        setTransactions(txData);
        setAccounts(accData);
        
        // Auto-select case based on navigation state or defaults
        const stateTxId = location.state?.txId;
        const stateAccountId = location.state?.accountId;
        let initialCase = casesData[0];

        if (stateTxId) {
          const matchedCase = casesData.find((c) => c.linkedTransactions.includes(stateTxId));
          if (matchedCase) initialCase = matchedCase;
        } else if (stateAccountId) {
          const matchedCase = casesData.find((c) => c.linkedAccounts.includes(stateAccountId));
          if (matchedCase) initialCase = matchedCase;
        }

        setSelectedCase(initialCase || null);
        setInvestigationNotes(initialCase?.notes || '');
        setLoading(false);
      }
    );
  }, [location.state]);

  // Update notes input when selected case changes
  const handleCaseSelect = (c: FraudCase) => {
    setSelectedCase(c);
    setInvestigationNotes(c.notes || '');
  };

  // Find linked transactions and accounts for the active case
  const activeTransactions = selectedCase
    ? transactions.filter((tx) => selectedCase.linkedTransactions.includes(tx.id))
    : [];

  const activeAccounts = selectedCase
    ? accounts.filter((acc) => selectedCase.linkedAccounts.includes(acc.id))
    : [];

  // Custom descriptions/recommendations depending on case type
  const getCasePatterns = (caseId: string) => {
    switch (caseId) {
      case 'CASE-001':
        return [
          'Multiple rapid transfers to shell beneficiary names',
          'Consolidation of funds from 3 distinct regional centers',
          'IP addresses overlap with known money laundering targets',
          'Sanctioned jurisdiction transfer indicator triggered',
        ];
      case 'CASE-002':
        return [
          'Sanctioned Russian and Syrian entity linkages',
          'Cryptocurrency intermediary wallet consolidation',
          'Overlapping device identifiers used across distinct accounts',
          'Structuring transactions just below reporting thresholds',
        ];
      case 'CASE-003':
        return [
          'Phishing email campaign vectors confirmed',
          'Unusual password reset followed by immediate bank details change',
          'Rapid transfers to newly created external payment accounts',
          'IP location change from typical residential patterns',
        ];
      default:
        return [
          'Deviation from standard behavioral payment history',
          'Cross-border high value transfer anomalies',
          'Frequent change of recipient accounts',
        ];
    }
  };

  const getCaseRecommendations = (caseId: string) => {
    switch (caseId) {
      case 'CASE-001':
      case 'CASE-002':
        return [
          { icon: <FiTarget />, text: 'Freeze all linked accounts and wallets immediately', severity: 'critical' },
          { icon: <FiAlertCircle />, text: 'Submit Suspicious Activity Report (SAR) to FinCEN', severity: 'critical' },
          { icon: <FiCheckCircle />, text: 'Refer beneficial ownership profiles to legal counsel', severity: 'high' },
        ];
      default:
        return [
          { icon: <FiCheckCircle />, text: 'Initiate out-of-band KYC customer identity verification', severity: 'high' },
          { icon: <FiTrendingUp />, text: 'Rollback changes to originator account routing details', severity: 'high' },
          { icon: <FiAlertCircle />, text: 'Flag accounts for continuous real-time monitoring', severity: 'medium' },
        ];
    }
  };

  const getCaseRiskScore = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 92;
      case 'high':
        return 76;
      case 'medium':
        return 58;
      default:
        return 24;
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'var(--neon-red)';
      case 'high':
        return 'var(--neon-yellow)';
      case 'medium':
        return 'var(--neon-cyan)';
      default:
        return 'var(--neon-green)';
    }
  };

  const handleSaveNotes = () => {
    if (!selectedCase) return;
    api.updateCaseNotes(selectedCase.id, investigationNotes).then(() => {
      setIsNotesSaved(true);
      setTimeout(() => setIsNotesSaved(false), 2000);
      setCases((prev) =>
        prev.map((c) => (c.id === selectedCase.id ? { ...c, notes: investigationNotes } : c))
      );
    });
  };

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
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
        }}
      >
        {/* Left Column: Case Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ animation: 'slideInDown 0.5s ease-out' }}>
            <p className="eyebrow">CASE AUDIT QUEUE</p>
            <h2 style={{ marginTop: '4px' }}>Anomalies Workspace</h2>
          </div>

          <div
            className="panel"
            style={{
              padding: '16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 180px)',
              animation: 'slideInUp 0.5s ease-out both',
            }}
          >
            <h4 style={{ marginBottom: '8px' }}>Open Investigations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cases.map((c) => {
                const isActive = selectedCase?.id === c.id;
                const sevColor = getSeverityColor(c.severity);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleCaseSelect(c)}
                    style={{
                      padding: '14px',
                      background: isActive ? 'rgba(0, 217, 255, 0.08)' : 'rgba(15, 26, 53, 0.4)',
                      border: isActive ? '1.5px solid var(--neon-cyan)' : '1px solid var(--border-secondary)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    className="table-row-hover"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-tertiary)' }}>
                        {c.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${sevColor}`,
                          color: sevColor,
                          textTransform: 'uppercase',
                        }}
                      >
                        {c.severity}
                      </span>
                    </div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {c.title}
                    </strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiUser size={12} />
                        {c.assignee.split(' ')[0]}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock size={12} />
                        {c.createdDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Details & Interactive Actions */}
        {loading || !selectedCase ? (
          <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Syncing Cases from Zoho Catalyst...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            {/* Header Panel */}
            <div
              className="panel"
              style={{
                padding: '24px',
                animation: 'slideInDown 0.5s ease-out 0.1s both',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <FiBriefcase style={{ color: 'var(--neon-cyan)' }} />
                <span style={{ fontSize: '0.85rem', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-tertiary)' }}>
                  Active Investigation / {selectedCase.id}
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>{selectedCase.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>{selectedCase.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={selectedCase.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                disabled={!canEscalate}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-primary)',
                  background: 'rgba(15, 26, 53, 0.6)',
                  color: 'var(--text-secondary)',
                  cursor: canEscalate ? 'pointer' : 'not-allowed',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="escalated">Escalated</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                className="btn btn-secondary"
                style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
                onClick={() => setShowFreezeModal(true)}
              >
                <FiLock size={16} />
                Emergency Freeze
              </button>

              <button
                className="btn btn-secondary"
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => setShowSec91(true)}
              >
                <FiShield size={18} />
                Sec 91/102 CrPC Notice
              </button>

              <button
                className="btn btn-primary"
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => navigate('/reports', { state: { caseId: selectedCase.id } })}
              >
                <FiFileText size={18} />
                AI Report
              </button>
            </div>
          </div>

          {/* Indicators grid: Risk Meter & Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Risk gauge */}
            <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.2s both' }}>
              <p className="eyebrow">RISK THREAT COEFFICIENT</p>
              <h4 style={{ marginBottom: '20px', marginTop: '8px' }}>Risk Assessment</h4>
              <EnhancedRiskMeter
                percentage={getCaseRiskScore(selectedCase.severity)}
                label="Aggregate Case Threat Level"
                description={`Confidence of malicious structural anomalies exceeds ${getCaseRiskScore(selectedCase.severity)}%.`}
                size="md"
              />
            </div>

            {/* AI Summary and Financial Metrics */}
            <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.2s both', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p className="eyebrow">FINANCIAL CRIME EXPOSURE</p>
              <h4 style={{ marginTop: '8px', marginBottom: '16px' }}>Volume Highlights</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                <div style={{ background: 'rgba(0, 217, 255, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Suspect Value</span>
                  <h2 style={{ color: 'var(--neon-cyan)', fontFamily: "'IBM Plex Mono', monospace", margin: '4px 0 0 0' }}>
                    ${selectedCase.totalAmount.toLocaleString()} USD
                  </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Owner Entity</span>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px' }}>{selectedCase.assignee}</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Status Code</span>
                    <div style={{ fontWeight: '600', color: getSeverityColor(selectedCase.severity), marginTop: '4px', textTransform: 'uppercase' }}>
                      {selectedCase.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linked entities list: Accounts & Transactions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Linked transactions */}
            <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.3s both' }}>
              <p className="eyebrow">TRIGGER TRANSACTION BUNDLE</p>
              <h4 style={{ marginTop: '8px', marginBottom: '16px' }}>Flagged Financial Flows</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                      <th style={{ padding: '8px', fontFamily: "'IBM Plex Mono', monospace" }}>TXID</th>
                      <th style={{ padding: '8px' }}>Sender</th>
                      <th style={{ padding: '8px' }}>Receiver</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => navigate('/transactions', { state: { search: tx.id } })}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                        className="table-row-hover"
                      >
                        <td style={{ padding: '10px 8px', color: 'var(--neon-cyan)', fontFamily: "'IBM Plex Mono', monospace" }}>{tx.id}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-primary)' }}>{tx.sender.split(' ')[0]}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-primary)' }}>{tx.receiver.split(' ')[0]}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontWeight: '700' }}>
                          ${tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Connected entities */}
            <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.3s both' }}>
              <p className="eyebrow">SUSPICIOUS ACCOUNTS LINKED</p>
              <h4 style={{ marginTop: '8px', marginBottom: '16px' }}>Risk Beneficiary Profiles</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => navigate('/network', { state: { accountId: acc.id } })}
                    style={{
                      padding: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '6px',
                      borderLeft: `3.5px solid ${getSeverityColor(acc.riskLevel)}`,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    className="table-row-hover"
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{acc.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>
                        Acc: {acc.id} • {acc.bank} ({acc.country})
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: getSeverityColor(acc.riskLevel) }}>
                      {acc.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suspicious Patterns Signals */}
          <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.4s both' }}>
            <p className="eyebrow">AI STRUCTURAL THREAT PATTERNS</p>
            <h4 style={{ marginTop: '8px', marginBottom: '16px' }}>Behavioral Signals</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {getCasePatterns(selectedCase.id).map((pattern, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: '8px',
                    borderLeft: '3px solid var(--neon-yellow)',
                  }}
                >
                  <span style={{ color: 'var(--neon-yellow)', fontSize: '1rem' }}>⚠️</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pattern}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Investigation Notes & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', marginBottom: '20px' }}>
            {/* Analyst investigation notes */}
            <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.4s both', display: 'flex', flexDirection: 'column' }}>
              <p className="eyebrow">ANALYST CASE LOGS</p>
              <h4 style={{ marginTop: '8px', marginBottom: '16px' }}>Notes & Hypotheses</h4>
              <textarea
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
                placeholder={canEditNotes ? "Enter audit logs, beneficial ownership findings, or comments..." : "You do not have write permissions to edit investigation logs."}
                disabled={!canEditNotes}
                style={{
                  flex: 1,
                  background: 'rgba(15, 26, 53, 0.4)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  padding: '12px',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  minHeight: '120px',
                  outline: 'none',
                  cursor: canEditNotes ? 'text' : 'not-allowed',
                }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleSaveNotes}
                disabled={!canEditNotes}
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  gap: '8px',
                  alignSelf: 'flex-end',
                  cursor: canEditNotes ? 'pointer' : 'not-allowed',
                  opacity: canEditNotes ? 1 : 0.6
                }}
              >
                {!canEditNotes ? (
                  <>
                    <FiLock size={14} />
                    Logs Locked
                  </>
                ) : isNotesSaved ? (
                  'Notes Logged ✔'
                ) : (
                  'Save Notes'
                )}
              </button>
            </div>

            {/* Recommendations actions items */}
            <div className="panel" style={{ animation: 'slideInUp 0.5s ease-out 0.4s both' }}>
              <p className="eyebrow">RECOMMENDED ACTION PLAYBOOKS</p>
              <h4 style={{ marginTop: '8px', marginBottom: '16px' }}>Mitigation Checklist</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {getCaseRecommendations(selectedCase.id).map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      background:
                        rec.severity === 'critical'
                          ? 'rgba(239, 68, 68, 0.08)'
                          : rec.severity === 'high'
                          ? 'rgba(245, 158, 11, 0.08)'
                          : 'rgba(56, 189, 248, 0.08)',
                      border:
                        rec.severity === 'critical'
                          ? '1px solid rgba(239, 68, 68, 0.2)'
                          : rec.severity === 'high'
                          ? '1px solid rgba(245, 158, 11, 0.2)'
                          : '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '6px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.1rem',
                        display: 'flex',
                        color:
                          rec.severity === 'critical'
                            ? '#fca5a5'
                            : rec.severity === 'high'
                            ? '#fde68a'
                            : '#7dd3fc',
                      }}
                    >
                      {rec.icon}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />

      {/* Official Legal Requisition Notice Modal */}
      <Sec91NoticeModal
        isOpen={showSec91}
        onClose={() => setShowSec91(false)}
        fraudCase={selectedCase}
      />

      {/* Instant Emergency Freeze Modal */}
      <EmergencyFreezeModal
        isOpen={showFreezeModal}
        onClose={() => setShowFreezeModal(false)}
        fraudCase={selectedCase}
      />
    </div>
  );
}

export default EnhancedFraudAnalysisPage;
