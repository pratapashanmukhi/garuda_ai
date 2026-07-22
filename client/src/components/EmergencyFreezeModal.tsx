import { useState, useEffect } from 'react';
import { FiX, FiAlertOctagon, FiCheckCircle, FiLock, FiShield, FiCpu } from 'react-icons/fi';
import type { FraudCase } from '../data/mockData';

interface EmergencyFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fraudCase: FraudCase | null;
}

export default function EmergencyFreezeModal({ isOpen, onClose, fraudCase }: EmergencyFreezeModalProps) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    'Connecting to Bank Nodal API Gateway...',
    'Injecting Sec 102 Cr.P.C Emergency Debit Freeze Token...',
    'Broadcasting Alert to FIU-IND & RBI Cyber Security Wing...',
    'Isolating Linked Beneficiary Accounts & Wallet Hubs...',
    'Locking Suspect Account Transactions ($12.5M USD Secured)...',
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setCompleted(false);
      const interval = setInterval(() => {
        setStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(interval);
          setCompleted(true);
          return prev;
        });
      }, 900);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !fraudCase) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(4, 10, 24, 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '600px',
          background: '#070f24',
          border: completed ? '2px solid var(--neon-green)' : '2px solid var(--neon-red)',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: completed ? '0 0 50px rgba(16, 185, 129, 0.3)' : '0 0 50px rgba(239, 68, 68, 0.4)',
          animation: 'slideInUp 0.3s ease-out',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem' }}>
            <FiX />
          </button>
        </div>

        <div style={{ margin: '0 auto 20px auto', width: '64px', height: '64px', borderRadius: '50%', background: completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: completed ? '#86efac' : '#fca5a5', fontSize: '2rem' }}>
          {completed ? <FiCheckCircle /> : <FiAlertOctagon style={{ animation: 'pulse 1.5s infinite' }} />}
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          {completed ? 'EMERGENCY ACCOUNT FREEZE EXECUTED' : 'EXECUTING INTERBANK DEBIT BLOCK'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '28px' }}>
          Case: <strong>{fraudCase.id} ({fraudCase.title})</strong> • Total Value: <strong>${fraudCase.totalAmount.toLocaleString()} USD</strong>
        </p>

        {/* Progress List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '32px', background: 'rgba(15, 26, 53, 0.4)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-secondary)' }}>
          {steps.map((text, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: idx <= step ? (completed && idx === steps.length - 1 ? '#86efac' : 'var(--text-primary)') : 'var(--text-quaternary)' }}>
              {idx < step || completed ? (
                <FiCheckCircle style={{ color: '#86efac', flexShrink: 0 }} />
              ) : idx === step ? (
                <FiCpu style={{ color: 'var(--neon-cyan)', animation: 'spin 2s linear infinite', flexShrink: 0 }} />
              ) : (
                <FiLock style={{ opacity: 0.3, flexShrink: 0 }} />
              )}
              <span style={{ fontWeight: idx === step ? '600' : 'normal' }}>{text}</span>
            </div>
          ))}
        </div>

        {completed ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: '8px', color: '#86efac', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FiShield /> SEC 102 Cr.P.C DEBIT FREEZE ACTIVE • NOTICE SENT TO BANK NODAL OFFICER
          </div>
        ) : (
          <button className="btn btn-secondary" disabled style={{ width: '100%', opacity: 0.7 }}>
            Locking Financial Accounts...
          </button>
        )}
      </div>
    </div>
  );
}
