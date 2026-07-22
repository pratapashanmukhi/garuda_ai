import type { Transaction } from '../data/mockData';

type TransactionTableProps = {
  data: Transaction[];
  onRowClick?: (tx: Transaction) => void;
  selectedId?: string;
};

function TransactionTable({ data, onRowClick, selectedId }: TransactionTableProps) {
  const getRiskClass = (score: number) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getStatusClass = (status: string) => {
    return status.toLowerCase();
  };

  return (
    <div className="table-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
      <div className="table-wrapper" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>TX ID</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>Origin (Sender)</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>Destination (Receiver)</th>
              <th style={{ textAlign: 'right', padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>Amount</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>Risk Score</th>
              <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text-tertiary)', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: selectedId === row.id ? 'rgba(0, 217, 255, 0.08)' : 'transparent',
                    transition: 'background var(--transition-fast)',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '14px 16px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--neon-cyan)', fontSize: '0.9rem', fontWeight: '600' }}>
                    {row.id}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{row.sender}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>
                      {row.senderAccount} • {row.senderCountry}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{row.receiver}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: "'IBM Plex Mono', monospace" }}>
                      {row.receiverAccount} • {row.receiverCountry}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {row.amount.toLocaleString(undefined, { style: 'currency', currency: row.currency })}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      className={`risk-pill ${getRiskClass(row.riskScore)}`}
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        fontFamily: "'IBM Plex Mono', monospace"
                      }}
                    >
                      {row.riskScore}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      className={`status-pill ${getStatusClass(row.status)}`}
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
