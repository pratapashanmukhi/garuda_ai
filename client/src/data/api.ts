import { mockTransactions, mockCases, mockAccounts, mockReports } from './mockData';
import type { Transaction, FraudCase, Account, InvestigationReport } from './mockData';
import type { User } from '../contexts/AuthContext';

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  target: string;
  timestamp: string;
}

// Zoho Catalyst local serve endpoint path
const BASE_URL = 'http://localhost:3000/server/garuda_backend/api';

// Helper to determine if server is active (silently fails over to mock if offline)
async function fetchFromBackend<T>(path: string, fallbackData: T, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('garuda_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json() as T;
  } catch (err) {
    console.warn(`[GARUDA Backend Fallback] API Call to ${path} failed. Using mock data.`, err);
    return fallbackData;
  }
}

export const api = {
  // Auth calls
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Invalid credentials');
    }
    return res.json();
  },

  register: async (name: string, email: string, password: string, role: string): Promise<{ token: string; user: User }> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Registration failed');
    }
    return res.json();
  },

  // Get all transactions
  getTransactions: async (): Promise<Transaction[]> => {
    return fetchFromBackend<Transaction[]>('/transactions', mockTransactions);
  },

  // Get all open fraud cases
  getCases: async (): Promise<FraudCase[]> => {
    return fetchFromBackend<FraudCase[]>('/cases', mockCases);
  },

  // Add notes to a specific fraud case
  updateCaseNotes: async (caseId: string, notes: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('garuda_token');
      const res = await fetch(`${BASE_URL}/cases/${caseId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ notes }),
      });
      return res.ok;
    } catch (err) {
      console.warn(`[GARUDA Backend Fallback] Note update failed, falling back to local storage.`);
      const matched = mockCases.find(c => c.id === caseId);
      if (matched) matched.notes = notes;
      return true;
    }
  },

  // Escalate a fraud case status
  escalateCase: async (caseId: string, status: 'open' | 'investigating' | 'escalated' | 'resolved'): Promise<boolean> => {
    try {
      const token = localStorage.getItem('garuda_token');
      const res = await fetch(`${BASE_URL}/cases/${caseId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch (err) {
      console.warn(`[GARUDA Backend Fallback] Status update failed, falling back to local update.`);
      const matched = mockCases.find(c => c.id === caseId);
      if (matched) matched.status = status;
      return true;
    }
  },

  // Get all accounts
  getAccounts: async (): Promise<Account[]> => {
    return fetchFromBackend<Account[]>('/accounts', mockAccounts);
  },

  // Get all compliance reports
  getReports: async (): Promise<InvestigationReport[]> => {
    return fetchFromBackend<InvestigationReport[]>('/reports', mockReports);
  },

  // Generate an AI compliance/forensic report
  generateReport: async (caseId: string, apiKey?: string): Promise<InvestigationReport> => {
    const fallback = mockReports.find(r => r.caseId === caseId) || mockReports[0];
    return fetchFromBackend<InvestigationReport>('/reports/generate', fallback, {
      method: 'POST',
      body: JSON.stringify({ caseId, apiKey }),
    });
  },

  // Talk with AI Copilot chat
  chatWithCopilot: async (message: string, history: Array<{ role: string, content: string }>, apiKey?: string): Promise<string> => {
    try {
      const token = localStorage.getItem('garuda_token');
      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message, history, apiKey }),
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.warn('[GARUDA Backend Fallback] Chat API failed, using client simulation.');
      const lower = message.toLowerCase();
      if (lower.includes('layering') || lower.includes('case-001')) {
        return "Local Fallback: In Case CASE-001, ACC-5421 transferred $450,000 to Offshore banking in a classic layering velocity scheme.";
      }
      if (lower.includes('sanctions') || lower.includes('case-002')) {
        return "Local Fallback: Case CASE-002 involves sanctioned entity routing in Cyprus. Recommend immediate account suspension.";
      }
      return "Local Fallback: Connecting to local mock model. Please start the Zoho Catalyst server ('catalyst serve') to activate live Gemini API integration.";
    }
  },

  // Ingest transactions CSV statements
  ingestTransactions: async (fileName: string, fileContent: string): Promise<{ success: boolean; count: number }> => {
    const token = localStorage.getItem('garuda_token');
    const res = await fetch(`${BASE_URL}/transactions/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ fileName, fileContent })
    });
    if (!res.ok) {
      throw new Error('Failed to ingest transaction log file');
    }
    return res.json();
  },

  // Fetch security audit logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const mockAuditLogs: AuditLog[] = [
      { id: 'AUD-1001', userId: 'USER-1', userEmail: 'admin@garuda.ai', action: 'USER_LOGIN', target: 'Security Portal', timestamp: '2025-01-15T08:30:00Z' },
      { id: 'AUD-1002', userId: 'USER-2', userEmail: 'investigator@garuda.ai', action: 'CASE_NOTES_UPDATED', target: 'CASE-001 (Operation Layering Ring)', timestamp: '2025-01-15T09:12:00Z' },
      { id: 'AUD-1003', userId: 'USER-2', userEmail: 'investigator@garuda.ai', action: 'STATUS_ESCALATED', target: 'CASE-002 (Sanctions Evasion)', timestamp: '2025-01-15T10:05:00Z' },
      { id: 'AUD-1004', userId: 'USER-4', userEmail: 'officer@garuda.ai', action: 'STATEMENT_INGESTED', target: 'UPI_DUMP_JAN2025.csv (42 transfers)', timestamp: '2025-01-15T11:40:00Z' },
    ];
    return fetchFromBackend<AuditLog[]>('/audit-logs', mockAuditLogs);
  }
};
