import { FiX, FiPrinter, FiShield } from 'react-icons/fi';
import type { FraudCase } from '../data/mockData';

interface Sec91NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fraudCase: FraudCase | null;
}

export default function Sec91NoticeModal({ isOpen, onClose, fraudCase }: Sec91NoticeModalProps) {
  const stationName = 'Cyber Crime Police Station, CID Karnataka';
  const investigatorName = 'Inspector R. K. Patil, KPS';
  const noticeRef = `NOTICE/CCPS/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

  if (!isOpen || !fraudCase) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(4, 10, 24, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0a1329',
          border: '1.5px solid var(--neon-cyan)',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 0 40px rgba(0, 217, 255, 0.2)',
          animation: 'slideInUp 0.3s ease-out',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiShield style={{ color: 'var(--neon-cyan)', fontSize: '1.5rem' }} />
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>Official Legal Requisition Draft</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Section 91 & Section 102 Cr.P.C / BNSS Emergency Requisition</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <FiPrinter /> Print / Export PDF
            </button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.2rem' }}>
              <FiX />
            </button>
          </div>
        </div>

        {/* Requisition Document Notice Body */}
        <div
          id="legal-notice-document"
          style={{
            background: '#ffffff',
            color: '#1e293b',
            padding: '40px',
            borderRadius: '8px',
            fontFamily: "'Times New Roman', Times, serif",
            lineHeight: 1.6,
            fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Official Emblem & Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              KARNATAKA STATE POLICE
            </h2>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: '600' }}>
              CYBER CRIME POLICE STATION • FINANCIAL CRIME WING
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Requisition for Emergency Debit Freezing & Account Information
            </p>
          </div>

          {/* Reference Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
            <div>
              <strong>NOTICE REF NO:</strong> {noticeRef}<br />
              <strong>CASE REFERENCE:</strong> {fraudCase.id} ({fraudCase.title})
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>DATE:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}<br />
              <strong>URGENCY:</strong> CRITICAL / IMMEDIATE
            </div>
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: '20px' }}>
            <strong>TO,</strong><br />
            THE NODAL OFFICER / MANAGER (COMPLIANCE & AML),<br />
            TARGET BANK / PAYMENT SERVICE PROVIDER HEADQUARTERS,<br />
            REPUBLIC OF INDIA.
          </div>

          {/* Subject */}
          <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '4px', borderLeft: '4px solid #0284c7', marginBottom: '20px', fontWeight: 'bold' }}>
            SUBJECT: REQUISITION UNDER SECTION 91 & SECTION 102 OF CODE OF CRIMINAL PROCEDURE (Cr.P.C) / SECTION 94 & SECTION 106 BNS IN REGARD TO CASE REF NO. {fraudCase.id} INVOLVING SUSPECT VALUE OF ${fraudCase.totalAmount.toLocaleString()} USD.
          </div>

          {/* Body Narrative */}
          <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
            Whereas, an investigation into a sophisticated cyber fraud and money laundering crime under Case Reference <strong>{fraudCase.id}</strong> is being carried out by the Cyber Crime Police.
          </p>

          <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
            During the course of automated forensic analysis by the <strong>GARUDA AI Platform</strong>, the following account numbers and transaction flows have been flagged for active layering, illicit beneficiary routing, and rapid velocity transfers:
          </p>

          {/* Table of Suspect Entities */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Suspect Account ID</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Linked Case Role</th>
                <th style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Threat Category</th>
              </tr>
            </thead>
            <tbody>
              {fraudCase.linkedAccounts.map((accId, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px', fontWeight: 'bold' }}>{accId}</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px' }}>Primary Layering Beneficiary</td>
                  <td style={{ border: '1px solid #cbd5e1', padding: '8px', color: '#b91c1c', fontWeight: 'bold' }}>High-Risk Suspect Account</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ textAlign: 'justify', marginBottom: '16px' }}>
            <strong>DIRECTIONS FOR COMPLIANCE:</strong><br />
            You are hereby directed under <strong>Section 102 Cr.P.C</strong> to immediately <strong>FREEZE ALL DEBIT OPERATIONS</strong> on the above-mentioned accounts and preserve all funds currently held in the accounts without delay.
          </p>

          <p style={{ textAlign: 'justify', marginBottom: '24px' }}>
            Further, under <strong>Section 91 Cr.P.C</strong>, you are directed to furnish the following within 24 hours of receipt of this notice:<br />
            1. Certified Account Opening Forms (AOF) & complete KYC documents (Aadhaar/PAN/Passport).<br />
            2. Complete Bank Account Statement from date of account inception to present.<br />
            3. IP logs, Device MAC addresses, and mobile banking login details used for authorized transfers.
          </p>

          {/* Signature Block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
            <div>
              <div style={{ width: '120px', height: '50px', borderBottom: '1px dashed #64748b', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>OFFICIAL POLICE SEAL</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>({investigatorName})</strong><br />
              INVESTIGATING OFFICER<br />
              {stationName}<br />
              KARNATAKA STATE POLICE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
