import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../data/api';
import { FiMail, FiLock, FiZap, FiAlertCircle } from 'react-icons/fi';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Direct login call to Zoho Catalyst AdvancedIO backend
      const res = await api.login(email, password);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      // Mock login check for offline/standalone local testing (self-healing demo)
      const mockAccounts = [
        { email: 'admin@garuda.ai', password: 'password123', name: 'John Admin', role: 'Administrator' as const },
        { email: 'investigator@garuda.ai', password: 'password123', name: 'Dr. Elena Rodriguez', role: 'Investigator' as const },
        { email: 'analyst@garuda.ai', password: 'password123', name: 'Sarah Analyst', role: 'Read-only Analyst' as const },
        { email: 'officer@garuda.ai', password: 'password123', name: 'Marcus Officer', role: 'Bank Officer' as const },
        { email: 'auditor@garuda.ai', password: 'password123', name: 'Sophia Auditor', role: 'Auditor' as const }
      ];

      const found = mockAccounts.find(u => u.email === email.toLowerCase() && u.password === password);
      if (found) {
        login('mock-jwt-token-12345', { id: `MOCK-${Date.now()}`, name: found.name, email: found.email, role: found.role });
        navigate('/dashboard');
      } else {
        setError(err.message || 'Invalid credentials. Try investigator@garuda.ai / password123');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(-45deg, #081229, #0f1a35, #1a2847, #081229)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        borderRadius: '12px',
        animation: 'slideInUp 0.5s ease-out'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan-light))',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary)',
            fontSize: '1.4rem'
          }}>
            <FiZap />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>GARUDA AI</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Financial Intelligence Platform</p>
          </div>
        </div>

        <h4 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Secure Portal Authorization
        </h4>

        {error && (
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '20px',
            alignItems: 'center'
          }}>
            <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>Security Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-quaternary)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@garuda.ai"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: 'rgba(15, 26, 53, 0.4)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>Access Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', textDecoration: 'none' }}>
                Forgot Key?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-quaternary)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: 'rgba(15, 26, 53, 0.4)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: '24px 0 0 0' }}>
          New agency account?{' '}
          <Link to="/register" style={{ color: 'var(--neon-cyan)', textDecoration: 'none', fontWeight: '600' }}>
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
