import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EnhancedNavbar from '../components/EnhancedNavbar';
import TransactionTable from '../components/TransactionTable';
import EnhancedRiskMeter from '../components/EnhancedRiskMeter';
import FloatingAIAssistant from '../components/FloatingAIAssistant';
import { api } from '../data/api';
import type { Transaction } from '../data/mockData';
import { FiX, FiClock, FiAlertOctagon, FiExternalLink, FiUpload, FiFile, FiCheck, FiAlertTriangle, FiLock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  // Ingestion state
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  const canUpload = user ? ['Administrator', 'Investigator', 'Senior Investigator', 'Bank Officer'].includes(user.role) : false;

  useEffect(() => {
    api.getTransactions().then(setTransactions);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const res = await api.ingestTransactions(file.name, text);
        setUploadStatus({ success: true, msg: `Successfully parsed and ingested ${res.count} transactions to Catalyst Data Store.` });
        setFile(null);
        api.getTransactions().then(setTransactions);
      } catch (err: any) {
        setUploadStatus({ success: false, msg: err.message || 'Error processing statement file.' });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsText(file);
  };

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('newest');

  const navigate = useNavigate();

  // Helper to determine risk category
  const getRiskCategory = (score: number) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const searchString = search.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(searchString) ||
      tx.sender.toLowerCase().includes(searchString) ||
      tx.senderAccount.toLowerCase().includes(searchString) ||
      tx.receiver.toLowerCase().includes(searchString) ||
      tx.receiverAccount.toLowerCase().includes(searchString);

    const riskCat = getRiskCategory(tx.riskScore);
    const matchesRisk = riskFilter === 'all' || riskCat === riskFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortField) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'risk-desc':
        return b.riskScore - a.riskScore;
      default:
        return 0;
    }
  });

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

      {/* Main Content Area */}
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
        }}
      >
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', animation: 'slideInDown 0.5s ease-out' }}>
          <div>
            <p className="eyebrow">TRANSACTION INTELLIGENCE</p>
            <h2 style={{ marginTop: '8px' }}>Payments & Transfers</h2>
          </div>
          <button
            className="btn btn-secondary"
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            onClick={() => setShowUpload(!showUpload)}
          >
            <FiUpload />
            Ingest Bank Statements
          </button>
        </div>

        {/* Ingestion Panel */}
        {showUpload && (
          <div
            className="panel"
            style={{
              padding: '24px',
              marginBottom: '20px',
              animation: 'slideInDown 0.3s ease-out',
              border: '1.5px solid var(--neon-cyan)',
              background: 'rgba(0, 217, 255, 0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Batch Statement Ingestion Console</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Upload CSV dumps of bank transfers. Garuda AI will extract narration parameters, normalize formats, and identify potential money laundering links.
                </p>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <FiX size={18} />
              </button>
            </div>

            {!canUpload ? (
              <div style={{ display: 'flex', gap: '8px', padding: '16px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', alignItems: 'center', color: '#fca5a5', fontSize: '0.85rem' }}>
                <FiLock size={16} />
                <span>Your profile role ({user?.role}) does not possess authorization to write or ingest new transaction payloads to the Catalyst Data Store.</span>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  border: '2px dashed var(--border-primary)',
                  borderRadius: '8px',
                  padding: '30px',
                  textAlign: 'center',
                  background: 'rgba(15, 26, 53, 0.4)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <FiUpload size={32} style={{ color: 'var(--neon-cyan)', marginBottom: '12px', opacity: 0.8 }} />
                  {file ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                      <FiFile />
                      <strong>{file.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Drag & drop a CSV statement file here, or click to browse
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Required columns: id, sender, senderAccount, receiver, receiverAccount, amount, currency, Date
                      </span>
                    </div>
                  )}
                </div>

                {uploadStatus && (
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    alignItems: 'center',
                    background: uploadStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: uploadStatus.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: uploadStatus.success ? '#86efac' : '#fca5a5'
                  }}>
                    {uploadStatus.success ? <FiCheck size={16} /> : <FiAlertTriangle size={16} />}
                    <span>{uploadStatus.msg}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setUploadStatus(null); }}
                    className="btn btn-secondary"
                    disabled={uploading}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading || !file}
                  >
                    {uploading ? 'Parsing & Structuring...' : 'Execute Ingestion'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filter Bar */}
        <div
          className="panel"
          style={{
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by ID, account, sender or receiver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'rgba(15, 26, 53, 0.4)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'rgba(15, 26, 53, 0.6)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk (80+)</option>
              <option value="high">High Risk (60-79)</option>
              <option value="medium">Medium Risk (40-59)</option>
              <option value="low">Low Risk (&lt;40)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'rgba(15, 26, 53, 0.6)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="clear">Clear</option>
              <option value="review">Review</option>
              <option value="flagged">Flagged</option>
              <option value="escalated">Escalated</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'rgba(15, 26, 53, 0.6)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount-desc">Sort: Amount (High to Low)</option>
              <option value="amount-asc">Sort: Amount (Low to High)</option>
              <option value="risk-desc">Sort: Risk (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Core Layout Split */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedTx ? '1fr 380px' : '1fr', gap: '20px', flex: 1, minHeight: 0 }}>
          {/* Left panel: Table */}
          <div
            className="panel"
            style={{
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInUp 0.5s ease-out both',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Payment Transactions</h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Showing {sortedTransactions.length} of {transactions.length} transfers
                </p>
              </div>
            </div>
            <TransactionTable
              data={sortedTransactions}
              onRowClick={(tx) => setSelectedTx(tx)}
              selectedId={selectedTx?.id}
            />
          </div>

          {/* Right panel: Sidebar detail view */}
          {selectedTx && (
            <div
              className="panel"
              style={{
                padding: '24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border-primary)',
                animation: 'slideInLeft 0.3s ease-out both',
                background: 'rgba(15, 26, 53, 0.7)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Detail Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: 'var(--neon-cyan)', margin: 0 }}>TX Analysis</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                  }}
                >
                  <FiX />
                </button>
              </div>

              {/* Core Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                <div>
                  <p className="eyebrow" style={{ fontSize: '0.75rem' }}>Transaction Identification</p>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '4px 0', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {selectedTx.id}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                    <FiClock />
                    <span>{new Date(selectedTx.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Category</span>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{selectedTx.category}</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Amount</span>
                    <div style={{ fontWeight: '700', color: 'var(--neon-cyan)', marginTop: '2px', fontFamily: "'IBM Plex Mono', monospace" }}>
                      {selectedTx.amount.toLocaleString(undefined, { style: 'currency', currency: selectedTx.currency })}
                    </div>
                  </div>
                </div>

                {/* Risk score */}
                <div>
                  <p className="eyebrow" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>AI Threat Evaluation</p>
                  <EnhancedRiskMeter
                    percentage={selectedTx.riskScore}
                    label="Threat Likelihood"
                    description={`Fraud probability calculated at ${(selectedTx.fraudProbability * 100).toFixed(0)}%.`}
                    size="sm"
                  />
                </div>

                {/* Sender/Receiver details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Origin */}
                  <div style={{ padding: '12px', background: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.1)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--neon-cyan)', margin: '0 0 6px 0', fontWeight: '700' }}>Originator (Sender)</p>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{selectedTx.sender}</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace", margin: '2px 0' }}>
                      Acc: {selectedTx.senderAccount}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {selectedTx.senderBank} • {selectedTx.senderCountry}
                    </span>
                  </div>

                  {/* Destination */}
                  <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--neon-purple)', margin: '0 0 6px 0', fontWeight: '700' }}>Beneficiary (Receiver)</p>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{selectedTx.receiver}</strong>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace", margin: '2px 0' }}>
                      Acc: {selectedTx.receiverAccount}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {selectedTx.receiverBank} • {selectedTx.receiverCountry}
                    </span>
                  </div>
                </div>

                {/* AI Verdict */}
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', color: 'var(--neon-red)' }}>
                    <FiAlertOctagon />
                    <span style={{ fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>AI Verdict Summary</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedTx.aiVerdict}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                <button
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                  onClick={() => navigate('/fraud-analysis', { state: { txId: selectedTx.id } })}
                >
                  Open in Investigation Workspace
                  <FiExternalLink />
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                  onClick={() => navigate('/network', { state: { accountId: selectedTx.senderAccount } })}
                >
                  Analyze Relationship Network
                  <FiExternalLink />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}

export default TransactionsPage;
