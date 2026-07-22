import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EnhancedNavbar from '../components/EnhancedNavbar';
import FloatingAIAssistant from '../components/FloatingAIAssistant';
import { api } from '../data/api';
import { FiX, FiGlobe, FiDollarSign } from 'react-icons/fi';

interface GraphNode {
  id: string;
  name: string;
  type: 'account' | 'external';
  risk: 'low' | 'medium' | 'high' | 'critical';
  x: number;
  y: number;
  bank: string;
  country: string;
  balance: number;
  txCount: number;
}

interface GraphLink {
  id: string;
  source: string;
  target: string;
  amount: number;
  riskScore: number;
  category: string;
  timestamp: string;
}

function NetworkPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Selected state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);

  // Filters
  const [riskFilter, setRiskFilter] = useState('all');

  // Graph Data
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate nodes & links on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([api.getAccounts(), api.getTransactions()]).then(([accs, txs]) => {
      const generatedNodes: GraphNode[] = [];
      const generatedLinks: GraphLink[] = [];

      const cx = 350;
      const cy = 250;
      const r = 180;

      // Use accounts as nodes
      const N = accs.length;
      accs.forEach((acc, i) => {
        const angle = (i * 2 * Math.PI) / N;
        generatedNodes.push({
          id: acc.id,
          name: acc.name,
          type: 'account',
          risk: acc.riskLevel,
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
          bank: acc.bank,
          country: acc.country,
          balance: acc.balance,
          txCount: acc.transactionCount,
        });
      });

      // Add a couple of central offshore / external nodes
      generatedNodes.push({
        id: 'ACC-9876',
        name: 'Offshore Corp (BVI)',
        type: 'external',
        risk: 'critical',
        x: cx,
        y: cy - 30,
        bank: 'Offshore Banking',
        country: 'BVI',
        balance: 14500000,
        txCount: 8,
      });

      generatedNodes.push({
        id: 'ACC-1122',
        name: 'Mystery Corp (Panama)',
        type: 'external',
        risk: 'critical',
        x: cx - 60,
        y: cy + 60,
        bank: 'Panama Trust',
        country: 'PA',
        balance: 8900000,
        txCount: 4,
      });

      generatedNodes.push({
        id: 'ACC-5555',
        name: 'Digital Assets Ltd',
        type: 'external',
        risk: 'high',
        x: cx + 70,
        y: cy + 60,
        bank: 'Digital Exchange',
        country: 'SG',
        balance: 4200000,
        txCount: 14,
      });

      // Link transactions between our nodes
      txs.forEach((tx) => {
        const sourceExists = generatedNodes.some((n) => n.id === tx.senderAccount);
        const targetExists = generatedNodes.some((n) => n.id === tx.receiverAccount);

        if (sourceExists && targetExists) {
          generatedLinks.push({
            id: tx.id,
            source: tx.senderAccount,
            target: tx.receiverAccount,
            amount: tx.amount,
            riskScore: tx.riskScore,
            category: tx.category,
            timestamp: tx.timestamp,
          });
        }
      });

      setNodes(generatedNodes);
      setLinks(generatedLinks);

      // If navigated with accountId state, auto-select that node
      const stateAccountId = location.state?.accountId;
      if (stateAccountId) {
        const nodeToSelect = generatedNodes.find((n) => n.id === stateAccountId);
        if (nodeToSelect) {
          setSelectedNode(nodeToSelect);
        }
      }
      setLoading(false);
    });
  }, [location.state]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return '#ef4444'; // var(--neon-red)
      case 'high':
        return '#f59e0b'; // var(--neon-yellow)
      case 'medium':
        return '#00d9ff'; // var(--neon-cyan)
      default:
        return '#10b981'; // var(--neon-green)
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setSelectedLink(null);
  };

  const handleLinkClick = (link: GraphLink) => {
    setSelectedLink(link);
    setSelectedNode(null);
  };

  // Filter nodes
  const filteredNodes = nodes.filter((n) => {
    if (riskFilter === 'all') return true;
    return n.risk === riskFilter;
  });

  // Keep links connected to visible nodes only
  const filteredLinks = links.filter((l) => {
    const sourceVisible = filteredNodes.some((n) => n.id === l.source);
    const targetVisible = filteredNodes.some((n) => n.id === l.target);
    return sourceVisible && targetVisible;
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
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: '24px', animation: 'slideInDown 0.5s ease-out' }}>
          <p className="eyebrow">RELATIONSHIP MAPPING</p>
          <h2 style={{ marginTop: '8px' }}>Entity Network Linkage</h2>
        </div>

        {/* Toolbar Panel */}
        <div
          className="panel"
          style={{
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filter Threat Level:</span>
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'rgba(15, 26, 53, 0.6)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Entities</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            Nodes: {filteredNodes.length} • Links: {filteredLinks.length}
          </span>
        </div>

        {/* Core Layout Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', flex: 1, minHeight: 0 }}>
          {/* Left panel: Network Graph Canvas */}
          <div
            className="panel"
            style={{
              padding: 0,
              background: '#040a18',
              border: '1px solid var(--border-primary)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              minHeight: '450px',
              animation: 'slideInUp 0.5s ease-out both',
            }}
          >
            {loading ? (
              <span style={{ color: 'var(--text-secondary)' }}>Syncing Relationship Graph from Zoho Catalyst...</span>
            ) : (
              <>
                {/* Legend / Overlay */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 26, 53, 0.6)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Critical Threat</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 26, 53, 0.6)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High Risk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 26, 53, 0.6)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00d9ff' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Medium Risk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 26, 53, 0.6)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Low Risk</span>
              </div>
            </div>

            {/* Interactive SVG canvas */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 700 500"
              style={{ display: 'block', maxHeight: '550px' }}
            >
              {/* Arrow markers for directions */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(0, 217, 255, 0.4)" />
                </marker>
                <marker
                  id="arrow-selected"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--neon-cyan)" />
                </marker>
              </defs>

              {/* Draw Link Lines */}
              {filteredLinks.map((link) => {
                const srcNode = filteredNodes.find((n) => n.id === link.source);
                const tgtNode = filteredNodes.find((n) => n.id === link.target);

                if (!srcNode || !tgtNode) return null;

                const isSelected = selectedLink?.id === link.id;
                const isHovered = hoveredLink?.id === link.id;

                return (
                  <g key={link.id}>
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isSelected ? 'var(--neon-cyan)' : isHovered ? 'rgba(0, 217, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                      markerEnd={isSelected ? 'url(#arrow-selected)' : 'url(#arrow)'}
                      onClick={() => handleLinkClick(link)}
                      onMouseEnter={() => setHoveredLink(link)}
                      onMouseLeave={() => setHoveredLink(null)}
                      style={{ cursor: 'pointer', transition: 'stroke 0.2s, stroke-width 0.2s' }}
                    />
                    {/* Visual glowing center dot on line */}
                    <circle
                      cx={(srcNode.x + tgtNode.x) / 2}
                      cy={(srcNode.y + tgtNode.y) / 2}
                      r={isSelected || isHovered ? 4 : 2}
                      fill={isSelected ? 'var(--neon-cyan)' : 'rgba(0, 217, 255, 0.4)'}
                      style={{ pointerEvents: 'none' }}
                    />
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const nodeColor = getRiskColor(node.risk);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Ring highlight on select/hover */}
                    <circle
                      r={isSelected ? 18 : isHovered ? 15 : 12}
                      fill="none"
                      stroke={isSelected ? 'var(--neon-cyan)' : nodeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={isSelected ? 'none' : node.type === 'external' ? '3, 3' : 'none'}
                      style={{ transition: 'r 0.2s, stroke-width 0.2s' }}
                    />
                    {/* Core node circle */}
                    <circle
                      r={isSelected ? 10 : isHovered ? 9 : 8}
                      fill={nodeColor}
                      style={{
                        transition: 'r 0.2s',
                        filter: isHovered || isSelected ? `drop-shadow(0 0 6px ${nodeColor})` : 'none',
                      }}
                    />
                    {/* Label */}
                    <text
                      y={node.type === 'external' ? -22 : 22}
                      textAnchor="middle"
                      fill={isSelected ? 'var(--neon-cyan)' : isHovered ? '#ffffff' : 'var(--text-secondary)'}
                      fontSize="9"
                      fontWeight={isSelected ? '700' : '500'}
                      style={{
                        pointerEvents: 'none',
                        fontFamily: 'Inter, sans-serif',
                        background: 'rgba(4, 10, 24, 0.8)',
                      }}
                    >
                      {node.name.split(' ')[0]} {/* Show first name for clean view */}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredNode && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#0f1a35',
                  border: `1.5px solid ${getRiskColor(hoveredNode.risk)}`,
                  borderRadius: '6px',
                  padding: '10px 14px',
                  pointerEvents: 'none',
                  fontSize: '0.8rem',
                  maxWidth: '220px',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div style={{ fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>{hoveredNode.name}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontFamily: "'IBM Plex Mono', monospace" }}>{hoveredNode.id}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span>Risk Level:</span>
                  <span style={{ fontWeight: '700', color: getRiskColor(hoveredNode.risk), textTransform: 'uppercase' }}>
                    {hoveredNode.risk}
                  </span>
                </div>
              </div>
            )}

            {hoveredLink && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#0f1a35',
                  border: '1.5px solid var(--neon-cyan)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  pointerEvents: 'none',
                  fontSize: '0.8rem',
                  maxWidth: '220px',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div style={{ fontWeight: '700', color: 'var(--neon-cyan)', marginBottom: '4px' }}>Transfer Link</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Amount:</span>
                  <strong style={{ fontFamily: "'IBM Plex Mono', monospace" }}>${hoveredLink.amount.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Threat Score:</span>
                  <strong style={{ color: hoveredLink.riskScore >= 80 ? 'var(--neon-red)' : 'var(--neon-yellow)' }}>{hoveredLink.riskScore}</strong>
                </div>
              </div>
            )}
              </>
            )}
          </div>

          {/* Right panel: Sidebar Details / Action Panel */}
          <div
            className="panel"
            style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--border-primary)',
              background: 'rgba(15, 26, 53, 0.7)',
              backdropFilter: 'blur(20px)',
              animation: 'slideInLeft 0.3s ease-out both',
            }}
          >
            {/* Details Content */}
            {!selectedNode && !selectedLink ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <FiGlobe size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <h4>Select Node or Link</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                  Click on an account node or a transfer path to view relationship properties and trace suspicious financial linkages.
                </p>
              </div>
            ) : selectedNode ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Node Detail Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--neon-cyan)', margin: 0 }}>Account Node</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex' }}
                  >
                    <FiX />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <span className="eyebrow" style={{ fontSize: '0.75rem' }}>Entity Name</span>
                    <h3 style={{ margin: '4px 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{selectedNode.name}</h3>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                      {selectedNode.id}
                    </span>
                  </div>

                  {/* Indicators */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Threat Posture</span>
                      <div style={{ fontWeight: '700', color: getRiskColor(selectedNode.risk), marginTop: '4px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                        {selectedNode.risk}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Linked Trans.</span>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px', fontSize: '0.9rem' }}>
                        {selectedNode.txCount} triggers
                      </div>
                    </div>
                  </div>

                  {/* Financial Balance */}
                  <div style={{ padding: '14px', background: 'rgba(0, 217, 255, 0.05)', border: '1px solid rgba(0, 217, 255, 0.1)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)', marginBottom: '4px' }}>
                      <FiDollarSign />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Available Balance</span>
                    </div>
                    <h2 style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-primary)' }}>
                      ${selectedNode.balance.toLocaleString()}
                    </h2>
                  </div>

                  {/* Bank & Country */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Institution:</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{selectedNode.bank}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Jurisdiction:</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{selectedNode.country}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Type:</span>
                      <span style={{ fontWeight: '600', color: 'var(--neon-cyan)', textTransform: 'capitalize' }}>{selectedNode.type}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => navigate('/transactions', { state: { search: selectedNode.id } })}
                  >
                    View All Transactions
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                    onClick={() => navigate('/fraud-analysis', { state: { accountId: selectedNode.id } })}
                  >
                    Investigate Threat Profile
                  </button>
                </div>
              </div>
            ) : selectedLink ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Link Detail Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--neon-cyan)', margin: 0 }}>Transfer Link</h3>
                  <button
                    onClick={() => setSelectedLink(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex' }}
                  >
                    <FiX />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <span className="eyebrow" style={{ fontSize: '0.75rem' }}>Transaction ID</span>
                    <h3 style={{ margin: '4px 0', fontSize: '1.4rem', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--neon-cyan)' }}>
                      {selectedLink.id}
                    </h3>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                      Category: {selectedLink.category}
                    </span>
                  </div>

                  {/* Flow info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Source:</span>
                      <span style={{ fontWeight: '600', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-primary)' }}>{selectedLink.source}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Target:</span>
                      <span style={{ fontWeight: '600', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-primary)' }}>{selectedLink.target}</span>
                    </div>
                  </div>

                  {/* Amount & Risk Indicators */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'rgba(0, 217, 255, 0.05)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Amount Sent</span>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.1rem' }}>
                        ${selectedLink.amount.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Risk Score</span>
                      <div style={{ fontWeight: '700', color: selectedLink.riskScore >= 80 ? 'var(--neon-red)' : 'var(--neon-yellow)', marginTop: '4px', fontSize: '1.1rem' }}>
                        {selectedLink.riskScore}/100
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="eyebrow" style={{ fontSize: '0.75rem' }}>Timestamp</span>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {new Date(selectedLink.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: '24px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => navigate('/transactions', { state: { search: selectedLink.id } })}
                  >
                    Analyze Transaction Details
                  </button>
                </div>
              </div>
            ) : null}  </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}

export default NetworkPage;
