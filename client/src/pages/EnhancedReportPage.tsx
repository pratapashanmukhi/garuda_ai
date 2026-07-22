import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import EnhancedNavbar from '../components/EnhancedNavbar';
import FloatingAIAssistant from '../components/FloatingAIAssistant';
import { api } from '../data/api';
import type { InvestigationReport } from '../data/mockData';

function EnhancedReportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stateCaseId = location.state?.caseId;
    setLoading(true);
    if (stateCaseId) {
      api.getReports().then((reports) => {
        const matched = reports.find((r) => r.caseId === stateCaseId);
        if (matched) {
          setReport(matched);
          setLoading(false);
        } else {
          const apiKey = localStorage.getItem('garuda_gemini_api_key') || undefined;
          api.generateReport(stateCaseId, apiKey).then((newReport) => {
            setReport(newReport);
            setLoading(false);
          });
        }
      });
    } else {
      api.getReports().then((reports) => {
        setReport(reports[0] || null);
        setLoading(false);
      });
    }
  }, [location.state]);

  // Derive additional findings dynamically based on case
  const getDynamicFindings = (caseId: string) => {
    switch (caseId) {
      case 'CASE-001':
        return [
          'Three high-risk accounts ACC-5421, ACC-2801, ACC-7634 shared a common transfer pattern.',
          'Consolidation transactions were executed in less than 15 minutes to Offshore Banking.',
          'AI layering risk score reached 95% and is recommended for immediate escalation.',
        ];
      case 'CASE-002':
        return [
          'Entity linkage detected with sanctioned accounts ACC-3344 and ACC-6767.',
          'Funds structured to evade reporting thresholds ($525,000 consolidated to Cypriot Finance).',
          'Cryptocurrency mixing behavior detected on destination wallets.',
        ];
      case 'CASE-003':
        return [
          'Phishing email vectors triggered account compromises for ACC-2233 and ACC-4545.',
          'Immediate password and beneficiary changes occurred prior to transfer initiation.',
          'AI takeover risk score flagged at 87% with multiple velocity alerts.',
        ];
      default:
        return [
          'Unusual velocity spike compared to baseline entity behavior.',
          'Multiple beneficiary accounts added and deleted within a 24-hour window.',
          'Transaction route utilizes high-risk routing jurisdictions.',
        ];
    }
  };

  const findings = report ? getDynamicFindings(report.caseId) : [];

  const timeline = [
    { time: '09:02', event: 'Entity Accounts Activity Scan Triggered', icon: '📝' },
    { time: '09:15', event: 'Suspicious Structuring Pattern Identified', icon: '💰' },
    { time: '09:18', event: 'Consolidated Cross-Border Transfers Initiated', icon: '📤' },
    { time: '09:22', event: 'Offshore Routing/Sanction Hub Detected', icon: '🌍' },
    { time: '09:25', event: 'GARUDA AI Platform High Risk Alert Triggered', icon: '🚨' },
  ];

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
        }}
      >
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            animation: 'slideInDown 0.5s ease-out',
          }}
        >
          <div>
            <p className="eyebrow">CASE REPORTING</p>
            <h2 style={{ marginTop: '8px' }}>AI Forensic Investigation</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary">
              <FiPrinter size={18} />
              Print
            </button>
            <button className="btn btn-primary">
              <FiDownload size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Report Container */}
        {loading || !report ? (
          <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', maxWidth: '1000px', margin: '0 auto' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Generating Forensic Audit Report from Zoho Catalyst...</span>
          </div>
        ) : (
          <div
            className="panel"
            style={{
              animation: 'slideInUp 0.5s ease-out',
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '40px',
            }}
          >
            {/* Header */}
            <div
              style={{
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--border-primary)',
              }}
            >
              <p className="eyebrow">REPORT IDENTIFIER: {report.id} • CASE REFERENCE: {report.caseId}</p>
              <h3 style={{ marginBottom: '8px', marginTop: '8px', fontSize: '1.6rem' }}>{report.title}</h3>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  marginTop: '12px',
                }}
              >
                <div
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#86efac',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  ✓ Approved for Compliance Review
                </div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', margin: 0 }}>
                  Generated on {report.generatedDate} by {report.analyst}
                </p>
              </div>
            </div>

            {/* Executive Summary */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--neon-cyan)' }}>Executive Summary</h4>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(0, 217, 255, 0.08)',
                  borderLeft: '3px solid var(--neon-cyan)',
                  borderRadius: '6px',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                }}
              >
                <p style={{ margin: 0 }}>{report.summary}</p>
              </div>
            </div>

            {/* Findings */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--neon-yellow)' }}>Forensic Findings</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {findings.map((finding, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(245, 158, 11, 0.05)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--neon-yellow)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ color: 'var(--neon-yellow)', fontWeight: 'bold' }}>✓</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '16px', color: 'var(--neon-cyan)' }}>Investigation Audit Trail</h4>
              <div
                style={{
                  position: 'relative',
                  paddingLeft: '32px',
                }}
              >
                {timeline.map((item, i) => (
                  <div key={i} style={{ marginBottom: i === timeline.length - 1 ? 0 : '20px', position: 'relative' }}>
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '2px',
                        width: '12px',
                        height: '12px',
                        background: 'var(--neon-cyan)',
                        borderRadius: '50%',
                        border: '2.5px solid var(--brand-secondary)',
                      }}
                    />
                    {/* Timeline line */}
                    {i < timeline.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '-27px',
                          top: '14px',
                          width: '2px',
                          height: '22px',
                          background: 'var(--neon-cyan)',
                          opacity: 0.3,
                        }}
                      />
                    )}
                    <div
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(0, 217, 255, 0.05)',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 217, 255, 0.1)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: '600', color: 'var(--neon-cyan)' }}>
                          {item.time}
                        </span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.event}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--neon-red)' }}>Threat Matrix</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>Overall Risk Rating</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fca5a5', margin: 0 }}>{report.riskLevel}</p>
                </div>
                <div style={{ padding: '14px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>Exhibits Count</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fde68a', margin: 0 }}>{report.evidenceCount} files</p>
                </div>
                <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: '0 0 4px 0' }}>Required Action</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fca5a5', margin: 0 }}>Auto-Escalated</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--neon-green)' }}>Recommended Mitigation Playbook</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                    <span style={{ color: 'var(--neon-green)' }}>●</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conclusion */}
            <div
              style={{
                paddingTop: '24px',
                borderTop: '1px solid var(--border-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', margin: 0 }}>
                  Generated by GARUDA AI Forensic Report Engine • System Confidence: 99.4%
                </p>
              </div>
              <button className="btn btn-primary">
                Export PDF Copy
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}

export default EnhancedReportPage;
