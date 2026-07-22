import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: string;
  fullHeight?: boolean;
  actions?: ReactNode;
}

function ChartCard({ title, subtitle, children, height = '300px', fullHeight = false, actions }: ChartCardProps) {
  return (
    <div className="panel" style={{ height: fullHeight ? '100%' : height, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h4 style={{ marginBottom: subtitle ? '4px' : '0' }}>{title}</h4>
          {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

export default ChartCard;
