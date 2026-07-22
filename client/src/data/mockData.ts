// Comprehensive Mock Data for GARUDA AI Platform

export interface Transaction {
  id: string;
  sender: string;
  senderAccount: string;
  receiver: string;
  receiverAccount: string;
  amount: number;
  currency: string;
  timestamp: string;
  senderCountry: string;
  receiverCountry: string;
  senderBank: string;
  receiverBank: string;
  riskScore: number;
  status: 'clear' | 'review' | 'flagged' | 'escalated' | 'blocked';
  aiVerdict: string;
  fraudProbability: number;
  category: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bank: string;
  country: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  balance: number;
  createdDate: string;
  lastActivity: string;
  transactionCount: number;
}

export interface FraudCase {
  id: string;
  title: string;
  status: 'open' | 'investigating' | 'escalated' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
  totalAmount: number;
  linkedAccounts: string[];
  linkedTransactions: string[];
  notes?: string;
}

export interface InvestigationReport {
  id: string;
  caseId: string;
  title: string;
  generatedDate: string;
  analyst: string;
  summary: string;
  riskLevel: string;
  evidenceCount: number;
  recommendations: string[];
}

export const mockTransactions: Transaction[] = [
  // High Risk Transactions
  { id: 'TX-001', sender: 'Ahmed Hassan', senderAccount: 'ACC-5421', receiver: 'Offshore Corp', receiverAccount: 'ACC-9876', amount: 450000, currency: 'USD', timestamp: '2025-01-15T09:02:00Z', senderCountry: 'US', receiverCountry: 'BVI', senderBank: 'Chase Manhattan', receiverBank: 'Offshore Banking', riskScore: 95, status: 'escalated', aiVerdict: 'High-risk offshore transfer showing classic layering behavior', fraudProbability: 0.92, category: 'Money Laundering' },
  { id: 'TX-002', sender: 'Sophia Chen', senderAccount: 'ACC-2801', receiver: 'Rapid Trade Inc', receiverAccount: 'ACC-4429', amount: 280000, currency: 'USD', timestamp: '2025-01-15T09:15:00Z', senderCountry: 'UK', receiverCountry: 'HK', senderBank: 'HSBC', receiverBank: 'International Trade', riskScore: 88, status: 'escalated', aiVerdict: 'Multiple rapid transfers to multiple jurisdictions', fraudProbability: 0.85, category: 'Structuring' },
  { id: 'TX-003', sender: 'Marco Rossi', senderAccount: 'ACC-7634', receiver: 'Mystery Corp', receiverAccount: 'ACC-1122', amount: 165000, currency: 'EUR', timestamp: '2025-01-15T09:18:00Z', senderCountry: 'IT', receiverCountry: 'PA', senderBank: 'Banca Italia', receiverBank: 'Panama Trust', riskScore: 91, status: 'escalated', aiVerdict: 'Velocity spike with offshore consolidation', fraudProbability: 0.88, category: 'Layering' },
  { id: 'TX-004', sender: 'Yuki Tanaka', senderAccount: 'ACC-9910', receiver: 'Digital Assets Ltd', receiverAccount: 'ACC-5555', amount: 320000, currency: 'JPY', timestamp: '2025-01-15T09:22:00Z', senderCountry: 'JP', receiverCountry: 'SG', senderBank: 'Mitsubishi UFJ', receiverBank: 'Digital Exchange', riskScore: 87, status: 'escalated', aiVerdict: 'Cryptocurrency exchange pattern with rapid onward transfer', fraudProbability: 0.86, category: 'Crypto Money Laundering' },
  { id: 'TX-005', sender: 'Ivan Petrov', senderAccount: 'ACC-3344', receiver: 'Shell Holdings', receiverAccount: 'ACC-7788', amount: 525000, currency: 'USD', timestamp: '2025-01-15T09:25:00Z', senderCountry: 'RU', receiverCountry: 'CY', senderBank: 'Sberbank', receiverBank: 'Cypriot Finance', riskScore: 94, status: 'escalated', aiVerdict: 'Complex layering with shell company involvement', fraudProbability: 0.91, category: 'Money Laundering' },
  // Medium Risk Transactions
  { id: 'TX-006', sender: 'Lisa Anderson', senderAccount: 'ACC-5501', receiver: 'Trade Partners', receiverAccount: 'ACC-6612', amount: 95000, currency: 'USD', timestamp: '2025-01-15T10:01:00Z', senderCountry: 'US', receiverCountry: 'MX', senderBank: 'Wells Fargo', receiverBank: 'Mexico Commerce', riskScore: 62, status: 'flagged', aiVerdict: 'Cross-border velocity increase noted', fraudProbability: 0.54, category: 'Suspicious Velocity' },
  { id: 'TX-007', sender: 'Juan Carlos', senderAccount: 'ACC-4521', receiver: 'Import Export Co', receiverAccount: 'ACC-8834', amount: 180000, currency: 'USD', timestamp: '2025-01-15T10:15:00Z', senderCountry: 'MX', receiverCountry: 'US', senderBank: 'Banamex', receiverBank: 'Bank of America', riskScore: 71, status: 'flagged', aiVerdict: 'Trade invoice mismatch detected', fraudProbability: 0.64, category: 'Trade Fraud' },
  { id: 'TX-008', sender: 'Priya Singh', senderAccount: 'ACC-2233', receiver: 'Tech Solutions', receiverAccount: 'ACC-9955', amount: 125000, currency: 'USD', timestamp: '2025-01-15T10:30:00Z', senderCountry: 'IN', receiverCountry: 'US', senderBank: 'ICICI Bank', receiverBank: 'Silicon Valley Bank', riskScore: 68, status: 'flagged', aiVerdict: 'Rapid account funding followed by immediate transfer', fraudProbability: 0.61, category: 'Account Takeover' },
  // Low Risk Transactions
  { id: 'TX-009', sender: 'Michael Brown', senderAccount: 'ACC-1010', receiver: 'Amazon Services', receiverAccount: 'ACC-2020', amount: 2500, currency: 'USD', timestamp: '2025-01-15T11:00:00Z', senderCountry: 'US', receiverCountry: 'US', senderBank: 'Chase', receiverBank: 'JP Morgan', riskScore: 15, status: 'clear', aiVerdict: 'Routine business transaction', fraudProbability: 0.05, category: 'Normal Commerce' },
  { id: 'TX-010', sender: 'Emma Wilson', senderAccount: 'ACC-3030', receiver: 'Netflix Inc', receiverAccount: 'ACC-4040', amount: 14.99, currency: 'USD', timestamp: '2025-01-15T11:15:00Z', senderCountry: 'US', receiverCountry: 'US', senderBank: 'Bank of America', receiverBank: 'Stripe Processing', riskScore: 8, status: 'clear', aiVerdict: 'Subscription payment', fraudProbability: 0.01, category: 'Subscriptions' },
  // Additional realistic transactions
  { id: 'TX-011', sender: 'David Kim', senderAccount: 'ACC-5656', receiver: 'Global Fund Mgmt', receiverAccount: 'ACC-7777', amount: 850000, currency: 'USD', timestamp: '2025-01-15T11:45:00Z', senderCountry: 'US', receiverCountry: 'CH', senderBank: 'Goldman Sachs', receiverBank: 'Swiss Banking', riskScore: 76, status: 'flagged', aiVerdict: 'Large wire to offshore investment account', fraudProbability: 0.68, category: 'Offshore Investment' },
  { id: 'TX-012', sender: 'Fatima Al-Rashid', senderAccount: 'ACC-8989', receiver: 'Business Consulting', receiverAccount: 'ACC-1001', amount: 220000, currency: 'USD', timestamp: '2025-01-15T12:00:00Z', senderCountry: 'AE', receiverCountry: 'UK', senderBank: 'Emirates NBD', receiverBank: 'Barclays', riskScore: 73, status: 'flagged', aiVerdict: 'Consulting fee pattern with onward transfer', fraudProbability: 0.66, category: 'Invoice Fraud' },
  { id: 'TX-013', sender: 'Carlos Rodriguez', senderAccount: 'ACC-4545', receiver: 'Import Goods Ltd', receiverAccount: 'ACC-5454', amount: 340000, currency: 'USD', timestamp: '2025-01-15T12:30:00Z', senderCountry: 'CO', receiverCountry: 'US', senderBank: 'Banco Occidente', receiverBank: 'Bank of New York', riskScore: 85, status: 'escalated', aiVerdict: 'High-risk import with velocity indicators', fraudProbability: 0.82, category: 'Smuggling Finance' },
  { id: 'TX-014', sender: 'Sarah Johnson', senderAccount: 'ACC-2121', receiver: 'Cloud Services Inc', receiverAccount: 'ACC-3232', amount: 5600, currency: 'USD', timestamp: '2025-01-15T13:00:00Z', senderCountry: 'US', receiverCountry: 'US', senderBank: 'Wells Fargo', receiverBank: 'AWS Payments', riskScore: 22, status: 'review', aiVerdict: 'Business service payment', fraudProbability: 0.12, category: 'Business Services' },
  { id: 'TX-015', sender: 'Dmitri Volkov', senderAccount: 'ACC-6767', receiver: 'Luxury Goods Trader', receiverAccount: 'ACC-8888', amount: 625000, currency: 'USD', timestamp: '2025-01-15T13:45:00Z', senderCountry: 'RU', receiverCountry: 'AE', senderBank: 'Gazprombank', receiverBank: 'Emirates Trade', riskScore: 92, status: 'escalated', aiVerdict: 'High-value goods transaction with sanctions concern', fraudProbability: 0.89, category: 'Sanctions Evasion' },
  { id: 'TX-016', sender: 'Rachel Lee', senderAccount: 'ACC-1212', receiver: 'Investment Partners', receiverAccount: 'ACC-3434', amount: 120000, currency: 'USD', timestamp: '2025-01-15T14:00:00Z', senderCountry: 'US', receiverCountry: 'US', senderBank: 'Morgan Stanley', receiverBank: 'Merrill Lynch', riskScore: 35, status: 'review', aiVerdict: 'Domestic investment transfer', fraudProbability: 0.25, category: 'Investment' },
  { id: 'TX-017', sender: 'Hassan Ibrahim', senderAccount: 'ACC-4646', receiver: 'Real Estate Holdings', receiverAccount: 'ACC-5757', amount: 2800000, currency: 'USD', timestamp: '2025-01-15T14:30:00Z', senderCountry: 'SA', receiverCountry: 'US', senderBank: 'Saudi National Bank', receiverBank: 'Real Estate Finance', riskScore: 79, status: 'flagged', aiVerdict: 'Large real estate acquisition with PEP involvement', fraudProbability: 0.72, category: 'PEP Concern' },
  // More variety
  { id: 'TX-018', sender: 'Anna Kowalski', senderAccount: 'ACC-7878', receiver: 'Manufacturing Corp', receiverAccount: 'ACC-9090', amount: 310000, currency: 'EUR', timestamp: '2025-01-15T15:00:00Z', senderCountry: 'PL', receiverCountry: 'DE', senderBank: 'PKO Bank Polski', receiverBank: 'Deutsche Bank', riskScore: 58, status: 'review', aiVerdict: 'European trade transaction', fraudProbability: 0.42, category: 'Trade' },
  { id: 'TX-019', sender: 'Wei Zhang', senderAccount: 'ACC-1919', receiver: 'Gems & Jewelry Co', receiverAccount: 'ACC-2020', amount: 890000, currency: 'USD', timestamp: '2025-01-15T15:30:00Z', senderCountry: 'CN', receiverCountry: 'DZ', senderBank: 'Industrial and Commercial Bank', receiverBank: 'Algerian Trade', riskScore: 88, status: 'escalated', aiVerdict: 'High-value commodity with sanctions risk', fraudProbability: 0.84, category: 'Sanctions Evasion' },
  { id: 'TX-020', sender: 'Roberto Ferrari', senderAccount: 'ACC-3535', receiver: 'Automotive Parts', receiverAccount: 'ACC-4646', amount: 156000, currency: 'EUR', timestamp: '2025-01-15T16:00:00Z', senderCountry: 'IT', receiverCountry: 'RO', senderBank: 'Intesa Sanpaolo', receiverBank: 'Romanian Finance', riskScore: 45, status: 'review', aiVerdict: 'Legitimate automotive trade', fraudProbability: 0.32, category: 'Trade' },
];

export const mockAccounts: Account[] = [
  { id: 'ACC-5421', name: 'Ahmed Hassan', email: 'a.hassan@email.com', accountNumber: '1234567890', bank: 'Chase Manhattan', country: 'US', riskLevel: 'critical', balance: 1250000, createdDate: '2024-01-15', lastActivity: '2025-01-15T09:02:00Z', transactionCount: 23 },
  { id: 'ACC-2801', name: 'Sophia Chen', email: 'sophia.chen@email.com', accountNumber: '9876543210', bank: 'HSBC', country: 'UK', riskLevel: 'critical', balance: 850000, createdDate: '2024-02-10', lastActivity: '2025-01-15T09:15:00Z', transactionCount: 18 },
  { id: 'ACC-7634', name: 'Marco Rossi', email: 'marco.rossi@email.com', accountNumber: '5555666677', bank: 'Banca Italia', country: 'IT', riskLevel: 'critical', balance: 620000, createdDate: '2024-03-05', lastActivity: '2025-01-15T09:18:00Z', transactionCount: 21 },
  { id: 'ACC-9910', name: 'Yuki Tanaka', email: 'yuki.tanaka@email.com', accountNumber: '1111222233', bank: 'Mitsubishi UFJ', country: 'JP', riskLevel: 'critical', balance: 920000, createdDate: '2024-01-20', lastActivity: '2025-01-15T09:22:00Z', transactionCount: 25 },
  { id: 'ACC-3344', name: 'Ivan Petrov', email: 'ivan.petrov@email.com', accountNumber: '4444555566', bank: 'Sberbank', country: 'RU', riskLevel: 'critical', balance: 1500000, createdDate: '2023-12-15', lastActivity: '2025-01-15T09:25:00Z', transactionCount: 32 },
  { id: 'ACC-5501', name: 'Lisa Anderson', email: 'lisa.anderson@email.com', accountNumber: '7777888899', bank: 'Wells Fargo', country: 'US', riskLevel: 'high', balance: 450000, createdDate: '2024-04-01', lastActivity: '2025-01-15T10:01:00Z', transactionCount: 14 },
  { id: 'ACC-4521', name: 'Juan Carlos', email: 'juan.carlos@email.com', accountNumber: '2222333344', bank: 'Banamex', country: 'MX', riskLevel: 'high', balance: 320000, createdDate: '2024-05-10', lastActivity: '2025-01-15T10:15:00Z', transactionCount: 12 },
  { id: 'ACC-2233', name: 'Priya Singh', email: 'priya.singh@email.com', accountNumber: '5566778899', bank: 'ICICI Bank', country: 'IN', riskLevel: 'high', balance: 280000, createdDate: '2024-06-15', lastActivity: '2025-01-15T10:30:00Z', transactionCount: 11 },
  { id: 'ACC-1010', name: 'Michael Brown', email: 'michael.brown@email.com', accountNumber: '1010101010', bank: 'Chase', country: 'US', riskLevel: 'low', balance: 85000, createdDate: '2023-06-01', lastActivity: '2025-01-15T11:00:00Z', transactionCount: 245 },
  { id: 'ACC-3030', name: 'Emma Wilson', email: 'emma.wilson@email.com', accountNumber: '3030303030', bank: 'Bank of America', country: 'US', riskLevel: 'low', balance: 25000, createdDate: '2022-01-15', lastActivity: '2025-01-15T11:15:00Z', transactionCount: 156 },
  { id: 'ACC-5656', name: 'David Kim', email: 'david.kim@email.com', accountNumber: '5656565656', bank: 'Goldman Sachs', country: 'US', riskLevel: 'high', balance: 3200000, createdDate: '2020-01-01', lastActivity: '2025-01-15T11:45:00Z', transactionCount: 87 },
  { id: 'ACC-8989', name: 'Fatima Al-Rashid', email: 'fatima.alrashid@email.com', accountNumber: '8989898989', bank: 'Emirates NBD', country: 'AE', riskLevel: 'high', balance: 1650000, createdDate: '2021-03-10', lastActivity: '2025-01-15T12:00:00Z', transactionCount: 64 },
  { id: 'ACC-4545', name: 'Carlos Rodriguez', email: 'carlos.rodriguez@email.com', accountNumber: '4545454545', bank: 'Banco Occidente', country: 'CO', riskLevel: 'critical', balance: 780000, createdDate: '2024-07-01', lastActivity: '2025-01-15T12:30:00Z', transactionCount: 28 },
  { id: 'ACC-2121', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', accountNumber: '2121212121', bank: 'Wells Fargo', country: 'US', riskLevel: 'low', balance: 125000, createdDate: '2021-09-15', lastActivity: '2025-01-15T13:00:00Z', transactionCount: 198 },
  { id: 'ACC-6767', name: 'Dmitri Volkov', email: 'dmitri.volkov@email.com', accountNumber: '6767676767', bank: 'Gazprombank', country: 'RU', riskLevel: 'critical', balance: 2100000, createdDate: '2023-11-01', lastActivity: '2025-01-15T13:45:00Z', transactionCount: 45 },
];

export const mockCases: FraudCase[] = [
  { id: 'CASE-001', title: 'Operation Layering Ring', status: 'investigating', severity: 'critical', assignee: 'John Smith', createdDate: '2025-01-10', lastUpdated: '2025-01-15T14:00:00Z', description: 'Complex international money laundering scheme involving multiple shell companies', totalAmount: 12500000, linkedAccounts: ['ACC-5421', 'ACC-2801', 'ACC-7634'], linkedTransactions: ['TX-001', 'TX-002', 'TX-003'] },
  { id: 'CASE-002', title: 'Sanctions Evasion Network', status: 'escalated', severity: 'critical', assignee: 'Maria Garcia', createdDate: '2025-01-08', lastUpdated: '2025-01-15T13:30:00Z', description: 'Coordinated sanctions evasion using cryptocurrency intermediaries', totalAmount: 8900000, linkedAccounts: ['ACC-3344', 'ACC-6767'], linkedTransactions: ['TX-015', 'TX-019'] },
  { id: 'CASE-003', title: 'Account Takeover Syndicate', status: 'investigating', severity: 'high', assignee: 'Robert Lee', createdDate: '2025-01-12', lastUpdated: '2025-01-15T12:45:00Z', description: 'Organized group targeting high-net-worth business accounts', totalAmount: 4200000, linkedAccounts: ['ACC-2233', 'ACC-4545'], linkedTransactions: ['TX-008', 'TX-013'] },
  { id: 'CASE-004', title: 'Trade Invoice Fraud Ring', status: 'investigating', severity: 'high', assignee: 'Sarah Chen', createdDate: '2025-01-11', lastUpdated: '2025-01-15T11:20:00Z', description: 'Fake trade invoices used to move funds across borders', totalAmount: 3200000, linkedAccounts: ['ACC-4521', 'ACC-8989'], linkedTransactions: ['TX-007', 'TX-012'] },
  { id: 'CASE-005', title: 'Cryptography Money Laundering', status: 'open', severity: 'high', assignee: 'James Wilson', createdDate: '2025-01-14', lastUpdated: '2025-01-15T10:00:00Z', description: 'Crypto exchange used as money laundering intermediary', totalAmount: 2100000, linkedAccounts: ['ACC-9910'], linkedTransactions: ['TX-004'] },
];

export const mockReports: InvestigationReport[] = [
  { id: 'RPT-001', caseId: 'CASE-001', title: 'Layering Ring - Preliminary Analysis', generatedDate: '2025-01-15', analyst: 'Dr. Elena Rodriguez', summary: 'Initial investigation reveals sophisticated layering through 15+ shell companies across 7 countries.', riskLevel: 'Critical', evidenceCount: 47, recommendations: ['Freeze all accounts', 'Coordinate with Interpol', 'Trace ultimate beneficial owners'] },
  { id: 'RPT-002', caseId: 'CASE-002', title: 'Sanctions Evasion - Technical Analysis', generatedDate: '2025-01-14', analyst: 'Prof. Michael Zhang', summary: 'Cryptocurrency transactions show deliberate evasion patterns matching known sanctions networks.', riskLevel: 'Critical', evidenceCount: 34, recommendations: ['Asset freeze', 'OFAC notification', 'FBI referral'] },
  { id: 'RPT-003', caseId: 'CASE-003', title: 'Account Takeover - Forensic Report', generatedDate: '2025-01-13', analyst: 'Marcus Johnson', summary: 'Evidence of coordinated phishing attacks followed by rapid fund movement.', riskLevel: 'High', evidenceCount: 28, recommendations: ['Issue fraud alert', 'Notify customers', 'Review security protocols'] },
  { id: 'RPT-004', caseId: 'CASE-004', title: 'Trade Fraud - Commercial Analysis', generatedDate: '2025-01-12', analyst: 'Lisa Martinez', summary: 'Fabricated bills of lading and shipping documents used to justify fund transfers.', riskLevel: 'High', evidenceCount: 31, recommendations: ['Contact shipping companies', 'Verify manufacturers', 'Extend investigation'] },
  { id: 'RPT-005', caseId: 'CASE-005', title: 'Crypto Laundering - Initial Assessment', generatedDate: '2025-01-10', analyst: 'David Thompson', summary: 'Structured deposits into exchange accounts with rapid conversion to fiat.', riskLevel: 'High', evidenceCount: 22, recommendations: ['Subpoena exchange records', 'Track fiat withdrawals', 'Monitor accounts'] },
];

export const dashboardStats = {
  transactionsToday: 847,
  fraudAlerts: 23,
  blockedAccounts: 5,
  investigationCases: 12,
  moneyLaunderingScore: 72,
  detectionAccuracy: 98.7,
  totalFraudYear: 2.4,
  fraudPatterns: 250,
  countriesSupported: 150,
};
