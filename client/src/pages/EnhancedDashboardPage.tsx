import { useState } from 'react';
import { FiActivity, FiAlertTriangle, FiUsers, FiFileText, FiDownload, FiFilter } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import EnhancedNavbar from '../components/EnhancedNavbar';
import AnimatedCounter from '../components/AnimatedCounter';
import TransactionTable from '../components/TransactionTable';
import FloatingAIAssistant from '../components/FloatingAIAssistant';
import ChartCard from '../components/ChartCard';
import { mockTransactions, dashboardStats } from '../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

function EnhancedDashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statCards = [
    {
      icon: <FiActivity />,
      title: 'Transactions Today',
      value: dashboardStats.transactionsToday,
      subtitle: '+8.2% from yesterday',
      accent: 'cyan',
    },
    {
      icon: <FiAlertTriangle />,
      title: 'Fraud Alerts',
      value: dashboardStats.fraudAlerts,
      subtitle: '3 critical, 7 high-risk',
      accent: 'red',
    },
    {
      icon: <FiUsers />,
      title: 'High Risk Accounts',
      value: 15,
      subtitle: '2 escalated for review',
      accent: 'yellow',
    },
    {
      icon: <FiFileText />,
      title: 'Active Cases',
      value: 12,
      subtitle: '5 under investigation',
      accent: 'green',
    },
  ];

  const volumeData = [
    { hour: '08:00', total: 120, flagged: 2 },
    { hour: '09:00', total: 340, flagged: 8 },
    { hour: '10:00', total: 450, flagged: 5 },
    { hour: '11:00', total: 290, flagged: 3 },
    { hour: '12:00', total: 510, flagged: 9 },
    { hour: '13:00', total: 680, flagged: 12 },
    { hour: '14:00', total: 490, flagged: 6 },
    { hour: '15:00', total: 720, flagged: 15 },
    { hour: '16:00', total: 847, flagged: 23 },
  ];

  const categoryData = [
    { name: 'Money Laundering', value: 35, color: '#ef4444' }, // neon-red
    { name: 'Sanctions Evasion', value: 25, color: '#a855f7' }, // neon-purple
    { name: 'Structuring', value: 20, color: '#f59e0b' }, // neon-yellow
    { name: 'Account Takeover', value: 15, color: '#00d9ff' }, // neon-cyan
    { name: 'Trade Fraud', value: 5, color: '#10b981' }, // neon-green
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gridTemplateRows: '70px 1fr', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ gridColumn: 1, gridRow: '1 / -1' }}>
        <Sidebar />
      </div>

      {/* Navbar */}
      <div style={{ gridColumn: 2, gridRow: 1, zIndex: 90 }}>
        <EnhancedNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isDarkMode={isDarkMode} onDarkModeChange={setIsDarkMode} />
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
            <p className="eyebrow">THREAT INTELLIGENCE OVERVIEW</p>
            <h2 style={{ marginTop: '8px' }}>Investigation Dashboard</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary">
              <FiFilter size={18} />
              Filter
            </button>
            <button className="btn btn-primary">
              <FiDownload size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
            marginBottom: '28px',
          }}
        >
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                animation: `slideInUp 0.5s ease-out ${0.1 + i * 0.1}s both`,
              }}
            >
              <div
                className="stat-icon"
                style={{
                  color:
                    stat.accent === 'cyan'
                      ? 'var(--neon-cyan)'
                      : stat.accent === 'red'
                      ? 'var(--neon-red)'
                      : stat.accent === 'yellow'
                      ? 'var(--neon-yellow)'
                      : 'var(--neon-green)',
                }}
              >
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.title}</div>
                <h3 style={{ marginBottom: '4px' }}>
                  <AnimatedCounter end={stat.value} duration={2} />
                </h3>
                <div className="stat-change">{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          {/* Chart 1: Transaction Volume */}
          <div style={{ animation: 'slideInUp 0.5s ease-out 0.2s both' }}>
            <ChartCard
              title="Transaction Velocity & Flags"
              subtitle="Real-time monitoring of volume versus suspicious triggers"
              height="350px"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--neon-red)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--neon-red)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="hour"
                    stroke="var(--text-quaternary)"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  />
                  <YAxis
                    stroke="var(--text-quaternary)"
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1a35',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Trans"
                    stroke="var(--neon-cyan)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="flagged"
                    name="Alert Triggers"
                    stroke="var(--neon-red)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFlagged)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Chart 2: Threat Distribution */}
          <div style={{ animation: 'slideInUp 0.5s ease-out 0.3s both' }}>
            <ChartCard
              title="Threat Pattern Distribution"
              subtitle="AI-categorized fraud threats for active cases"
              height="350px"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 4px ${entry.color}44)` }} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f1a35',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'Inter' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Main Transaction Table */}
        <div
          className="panel"
          style={{
            animation: 'slideInUp 0.5s ease-out 0.4s both',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <p className="eyebrow">LIVE ACTIVITY</p>
            <h3 style={{ marginTop: '8px', marginBottom: '4px' }}>Recent Transactions</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              Showing {mockTransactions.length} transactions from today
            </p>
          </div>
          <div className="table-wrapper">
            <TransactionTable data={mockTransactions.slice(0, 10)} />
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
}

export default EnhancedDashboardPage;
