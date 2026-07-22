import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiZap, FiCheckCircle } from 'react-icons/fi';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
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
          Access Key Recovery
        </h4>

        {submitted ? (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ color: 'var(--neon-green)', fontSize: '3rem', marginBottom: '16px' }}>
              <FiCheckCircle />
            </div>
            <h5 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '8px' }}>Request Dispatched</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
              If the email <strong>{email}</strong> is associated with an active investigator profile, a key reset token will arrive in your security inbox shortly.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 24px' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              Provide the official email registered to your profile. The system will dispatch an authorization override token.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>Official Email</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {loading ? 'Processing Override...' : 'Dispatch Reset Token'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: '12px 0 0 0' }}>
              Remember credentials?{' '}
              <Link to="/login" style={{ color: 'var(--neon-cyan)', textDecoration: 'none', fontWeight: '600' }}>
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
