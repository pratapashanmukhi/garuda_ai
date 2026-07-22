interface RiskMeterProps {
  percentage: number;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

function RiskMeter({ percentage, label, description, size = 'md' }: RiskMeterProps) {
  const getRiskColor = (percent: number) => {
    if (percent >= 80) return 'var(--neon-red)';
    if (percent >= 60) return 'var(--neon-yellow)';
    if (percent >= 40) return 'var(--neon-cyan)';
    return 'var(--neon-green)';
  };

  const getRiskLevel = (percent: number) => {
    if (percent >= 80) return 'Critical';
    if (percent >= 60) return 'High';
    if (percent >= 40) return 'Medium';
    return 'Low';
  };

  const sizes = {
    sm: { radius: 35, circumference: 220, width: '100px', height: '100px', fontSize: '1.2rem' },
    md: { radius: 45, circumference: 283, width: '140px', height: '140px', fontSize: '1.6rem' },
    lg: { radius: 60, circumference: 377, width: '180px', height: '180px', fontSize: '2rem' },
  };

  const s = sizes[size];
  const strokeDashoffset = s.circumference - (percentage / 100) * s.circumference;

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: s.width, height: s.height, flexShrink: 0 }}>
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r={s.radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={s.radius}
            fill="none"
            stroke={getRiskColor(percentage)}
            strokeWidth="6"
            strokeDasharray={s.circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s ease-out',
              filter: `drop-shadow(0 0 8px ${getRiskColor(percentage)})`,
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: getRiskColor(percentage),
          }}
        >
          <div style={{ fontSize: s.fontSize, fontWeight: '800', letterSpacing: '-1px' }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {getRiskLevel(percentage)}
          </div>
        </div>
      </div>

      {(label || description) && (
        <div>
          {label && <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{label}</h4>}
          {description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RiskMeter;
