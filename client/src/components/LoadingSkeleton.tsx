interface LoadingSkeletonProps {
  type?: 'text' | 'card' | 'table-row' | 'chart';
  count?: number;
  height?: string;
  width?: string;
}

function LoadingSkeleton({ type = 'text', count = 3, height = '16px', width = '100%' }: LoadingSkeletonProps) {
  if (type === 'text') {
    return (
      <div>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton-text"
            style={{ height, width, marginBottom: i === count - 1 ? '0' : '8px' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton skeleton-text" style={{ height: '24px', marginBottom: '16px' }} />
        <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '8px' }} />
        <div className="skeleton skeleton-text" style={{ height: '16px', width: '60%' }} />
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <tr>
        {Array.from({ length: 6 }).map((_, i) => (
          <td key={i}>
            <div className="skeleton skeleton-text" style={{ height: '16px' }} />
          </td>
        ))}
      </tr>
    );
  }

  if (type === 'chart') {
    return (
      <div className="skeleton-card" style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ height: '24px', width: '200px' }} />
        <div className="skeleton" style={{ flex: 1 }} />
      </div>
    );
  }

  return null;
}

export default LoadingSkeleton;
