import type { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent?: string;
};

function StatCard({ title, value, detail, icon, accent = 'cyan' }: StatCardProps) {
  return (
    <article className={`stat-card ${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-title">{title}</p>
        <h3>{value}</h3>
        <span>{detail}</span>
      </div>
    </article>
  );
}

export default StatCard;
