const express = require('express');
const cors = require('cors');
const catalyst = require('zcatalyst-sdk-node');
const { GoogleGenAI } = require('@google/generative-ai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'garuda-super-secret-key-123';

// ==========================================
// USER DATABASE / AUTH LOGIC & MOCKS
// ==========================================

const mockUsers = [
  { id: '1', name: 'John Admin', email: 'admin@garuda.ai', passwordHash: bcrypt.hashSync('password123', 8), role: 'Administrator' },
  { id: '2', name: 'Dr. Elena Rodriguez', email: 'investigator@garuda.ai', passwordHash: bcrypt.hashSync('password123', 8), role: 'Investigator' },
  { id: '3', name: 'Sarah Analyst', email: 'analyst@garuda.ai', passwordHash: bcrypt.hashSync('password123', 8), role: 'Read-only Analyst' },
  { id: '4', name: 'Marcus Officer', email: 'officer@garuda.ai', passwordHash: bcrypt.hashSync('password123', 8), role: 'Bank Officer' },
  { id: '5', name: 'Sophia Auditor', email: 'auditor@garuda.ai', passwordHash: bcrypt.hashSync('password123', 8), role: 'Auditor' }
];

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = {
    id: `USER-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: hashedPassword,
    role
  };

  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Users');
    
    // Check if user exists in Catalyst Data Store
    const existing = await table.selectRows({ email: email.toLowerCase() });
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    await table.insertRow({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password_hash: newUser.passwordHash,
      role: newUser.role,
      created_at: new Date().toISOString()
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) {
    console.log('Catalyst DB not provisioned or offline, falling back to in-memory registration');
    // Check in-memory list
    const found = mockUsers.find(u => u.email === email.toLowerCase());
    if (found) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    mockUsers.push(newUser);
    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Users');

    const records = await table.selectRows({ email: email.toLowerCase() });
    if (!records || records.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const record = records[0];
    const passwordIsValid = await bcrypt.compare(password, record.password_hash);
    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: record.id, role: record.role, email: record.email, name: record.name }, JWT_SECRET, { expiresIn: '24h' });
    await logAuditEvent(req, 'USER_LOGIN', `Portal auth for ${record.email}`);
    return res.json({ token, user: { id: record.id, name: record.name, email: record.email, role: record.role } });
  } catch (err) {
    console.log('Catalyst DB not provisioned or offline, falling back to in-memory login');
    const user = mockUsers.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    await logAuditEvent(req, 'USER_LOGIN', `Portal auth for ${user.email}`);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
});

// Profile endpoint
app.get('/api/auth/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Middleware for RBAC inside functions (if deployed)
const authorize = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Permission denied' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// ==========================================
// MOCK DATA FALLBACKS (for local testing & resilience)
// ==========================================

const mockTransactions = [
  { id: 'TX-001', sender: 'Ahmed Hassan', senderAccount: 'ACC-5421', receiver: 'Offshore Corp', receiverAccount: 'ACC-9876', amount: 450000, currency: 'USD', timestamp: '2025-01-15T09:02:00Z', senderCountry: 'US', receiverCountry: 'BVI', senderBank: 'Chase Manhattan', receiverBank: 'Offshore Banking', riskScore: 95, status: 'escalated', aiVerdict: 'High-risk offshore transfer showing classic layering behavior', fraudProbability: 0.92, category: 'Money Laundering' },
  { id: 'TX-002', sender: 'Sophia Chen', senderAccount: 'ACC-2801', receiver: 'Rapid Trade Inc', receiverAccount: 'ACC-4429', amount: 280000, currency: 'USD', timestamp: '2025-01-15T09:15:00Z', senderCountry: 'UK', receiverCountry: 'HK', senderBank: 'HSBC', receiverBank: 'International Trade', riskScore: 88, status: 'escalated', aiVerdict: 'Multiple rapid transfers to multiple jurisdictions', fraudProbability: 0.85, category: 'Structuring' },
  { id: 'TX-003', sender: 'Marco Rossi', senderAccount: 'ACC-7634', receiver: 'Mystery Corp', receiverAccount: 'ACC-1122', amount: 165000, currency: 'EUR', timestamp: '2025-01-15T09:18:00Z', senderCountry: 'IT', receiverCountry: 'PA', senderBank: 'Banca Italia', receiverBank: 'Panama Trust', riskScore: 91, status: 'escalated', aiVerdict: 'Velocity spike with offshore consolidation', fraudProbability: 0.88, category: 'Layering' },
  { id: 'TX-004', sender: 'Yuki Tanaka', senderAccount: 'ACC-9910', receiver: 'Digital Assets Ltd', receiverAccount: 'ACC-5555', amount: 320000, currency: 'JPY', timestamp: '2025-01-15T09:22:00Z', senderCountry: 'JP', receiverCountry: 'SG', senderBank: 'Mitsubishi UFJ', receiverBank: 'Digital Exchange', riskScore: 87, status: 'escalated', aiVerdict: 'Cryptocurrency exchange pattern with rapid onward transfer', fraudProbability: 0.86, category: 'Crypto Money Laundering' },
  { id: 'TX-005', sender: 'Ivan Petrov', senderAccount: 'ACC-3344', receiver: 'Shell Holdings', receiverAccount: 'ACC-7788', amount: 525000, currency: 'USD', timestamp: '2025-01-15T09:25:00Z', senderCountry: 'RU', receiverCountry: 'CY', senderBank: 'Sberbank', receiverBank: 'Cypriot Finance', riskScore: 94, status: 'escalated', aiVerdict: 'Complex layering with shell company involvement', fraudProbability: 0.91, category: 'Money Laundering' },
  { id: 'TX-006', sender: 'Lisa Anderson', senderAccount: 'ACC-5501', receiver: 'Trade Partners', receiverAccount: 'ACC-6612', amount: 95000, currency: 'USD', timestamp: '2025-01-15T10:01:00Z', senderCountry: 'US', receiverCountry: 'MX', senderBank: 'Wells Fargo', receiverBank: 'Mexico Commerce', riskScore: 62, status: 'flagged', aiVerdict: 'Cross-border velocity increase noted', fraudProbability: 0.54, category: 'Suspicious Velocity' },
  { id: 'TX-007', sender: 'Juan Carlos', senderAccount: 'ACC-4521', receiver: 'Import Export Co', receiverAccount: 'ACC-8834', amount: 180000, currency: 'USD', timestamp: '2025-01-15T10:15:00Z', senderCountry: 'MX', receiverCountry: 'US', senderBank: 'Banamex', receiverBank: 'Bank of America', riskScore: 71, status: 'flagged', aiVerdict: 'Trade invoice mismatch detected', fraudProbability: 0.64, category: 'Trade Fraud' },
  { id: 'TX-008', sender: 'Priya Singh', senderAccount: 'ACC-2233', receiver: 'Tech Solutions', receiverAccount: 'ACC-9955', amount: 125000, currency: 'USD', timestamp: '2025-01-15T10:30:00Z', senderCountry: 'IN', receiverCountry: 'US', senderBank: 'ICICI Bank', receiverBank: 'Silicon Valley Bank', riskScore: 68, status: 'flagged', aiVerdict: 'Rapid account funding followed by immediate transfer', fraudProbability: 0.61, category: 'Account Takeover' },
  { id: 'TX-009', sender: 'Michael Brown', senderAccount: 'ACC-1010', receiver: 'Amazon Services', receiverAccount: 'ACC-2020', amount: 2500, currency: 'USD', timestamp: '2025-01-15T11:00:00Z', senderCountry: 'US', receiverCountry: 'US', senderBank: 'Chase', receiverBank: 'JP Morgan', riskScore: 15, status: 'clear', aiVerdict: 'Routine business transaction', fraudProbability: 0.05, category: 'Normal Commerce' },
  { id: 'TX-010', sender: 'Emma Wilson', senderAccount: 'ACC-3030', receiver: 'Netflix Inc', receiverAccount: 'ACC-4040', amount: 14.99, currency: 'USD', timestamp: '2025-01-15T11:15:00Z', senderCountry: 'US', receiverCountry: 'US', senderBank: 'Bank of America', receiverBank: 'Stripe Processing', riskScore: 8, status: 'clear', aiVerdict: 'Subscription payment', fraudProbability: 0.01, category: 'Subscriptions' }
];

const mockAccounts = [
  { id: 'ACC-5421', name: 'Ahmed Hassan', email: 'a.hassan@email.com', accountNumber: '1234567890', bank: 'Chase Manhattan', country: 'US', riskLevel: 'critical', balance: 1250000, createdDate: '2024-01-15', lastActivity: '2025-01-15T09:02:00Z', transactionCount: 23 },
  { id: 'ACC-2801', name: 'Sophia Chen', email: 'sophia.chen@email.com', accountNumber: '9876543210', bank: 'HSBC', country: 'UK', riskLevel: 'critical', balance: 850000, createdDate: '2024-02-10', lastActivity: '2025-01-15T09:15:00Z', transactionCount: 18 },
  { id: 'ACC-7634', name: 'Marco Rossi', email: 'marco.rossi@email.com', accountNumber: '5555666677', bank: 'Banca Italia', country: 'IT', riskLevel: 'critical', balance: 620000, createdDate: '2024-03-05', lastActivity: '2025-01-15T09:18:00Z', transactionCount: 21 },
  { id: 'ACC-9910', name: 'Yuki Tanaka', email: 'yuki.tanaka@email.com', accountNumber: '1111222233', bank: 'Mitsubishi UFJ', country: 'JP', riskLevel: 'critical', balance: 920000, createdDate: '2024-01-20', lastActivity: '2025-01-15T09:22:00Z', transactionCount: 25 },
  { id: 'ACC-3344', name: 'Ivan Petrov', email: 'ivan.petrov@email.com', accountNumber: '4444555566', bank: 'Sberbank', country: 'RU', riskLevel: 'critical', balance: 1500000, createdDate: '2023-12-15', lastActivity: '2025-01-15T09:25:00Z', transactionCount: 32 },
  { id: 'ACC-5501', name: 'Lisa Anderson', email: 'lisa.anderson@email.com', accountNumber: '7777888899', bank: 'Wells Fargo', country: 'US', riskLevel: 'high', balance: 450000, createdDate: '2024-04-01', lastActivity: '2025-01-15T10:01:00Z', transactionCount: 14 }
];

const mockCases = [
  { id: 'CASE-001', title: 'Operation Layering Ring', status: 'investigating', severity: 'critical', assignee: 'John Smith', createdDate: '2025-01-10', lastUpdated: '2025-01-15T14:00:00Z', description: 'Complex international money laundering scheme involving multiple shell companies', totalAmount: 12500000, linkedAccounts: ['ACC-5421', 'ACC-2801', 'ACC-7634'], linkedTransactions: ['TX-001', 'TX-002', 'TX-003'], notes: '' },
  { id: 'CASE-002', title: 'Sanctions Evasion Network', status: 'escalated', severity: 'critical', assignee: 'Maria Garcia', createdDate: '2025-01-08', lastUpdated: '2025-01-15T13:30:00Z', description: 'Coordinated sanctions evasion using cryptocurrency intermediaries', totalAmount: 8900000, linkedAccounts: ['ACC-3344', 'ACC-6767'], linkedTransactions: ['TX-015', 'TX-019'], notes: '' },
  { id: 'CASE-003', title: 'Account Takeover Syndicate', status: 'investigating', severity: 'high', assignee: 'Robert Lee', createdDate: '2025-01-12', lastUpdated: '2025-01-15T12:45:00Z', description: 'Organized group targeting high-net-worth business accounts', totalAmount: 4200000, linkedAccounts: ['ACC-2233', 'ACC-4545'], linkedTransactions: ['TX-008', 'TX-013'], notes: '' }
];

const mockReports = [
  { id: 'RPT-001', caseId: 'CASE-001', title: 'Layering Ring - Preliminary Analysis', generatedDate: '2025-01-15', analyst: 'Dr. Elena Rodriguez', summary: 'Initial investigation reveals sophisticated layering through 15+ shell companies across 7 countries.', riskLevel: 'Critical', evidenceCount: 47, recommendations: ['Freeze all accounts', 'Coordinate with Interpol', 'Trace ultimate beneficial owners'] },
  { id: 'RPT-002', caseId: 'CASE-002', title: 'Sanctions Evasion - Technical Analysis', generatedDate: '2025-01-14', analyst: 'Prof. Michael Zhang', summary: 'Cryptocurrency transactions show deliberate evasion patterns matching known sanctions networks.', riskLevel: 'Critical', evidenceCount: 34, recommendations: ['Asset freeze', 'OFAC notification', 'FBI referral'] }
];

const mockStats = {
  transactionsToday: 847,
  fraudAlerts: 23,
  blockedAccounts: 5,
  investigationCases: 12,
  moneyLaunderingScore: 72,
  detectionAccuracy: 98.7,
  totalFraudYear: 2.4,
  fraudPatterns: 250,
  countriesSupported: 150
};

const mockAuditLogs = [
  { id: 'AUD-1001', userId: 'USER-1', userEmail: 'admin@garuda.ai', action: 'USER_LOGIN', target: 'Security Portal', timestamp: '2025-01-15T08:30:00Z' },
  { id: 'AUD-1002', userId: 'USER-2', userEmail: 'investigator@garuda.ai', action: 'CASE_NOTES_UPDATED', target: 'CASE-001 (Operation Layering Ring)', timestamp: '2025-01-15T09:12:00Z' },
  { id: 'AUD-1003', userId: 'USER-2', userEmail: 'investigator@garuda.ai', action: 'STATUS_ESCALATED', target: 'CASE-002 (Sanctions Evasion)', timestamp: '2025-01-15T10:05:00Z' },
  { id: 'AUD-1004', userId: 'USER-4', userEmail: 'officer@garuda.ai', action: 'STATEMENT_INGESTED', target: 'UPI_DUMP_JAN2025.csv (42 transfers)', timestamp: '2025-01-15T11:40:00Z' },
];

async function logAuditEvent(req, action, target) {
  const userEmail = req.user?.email || req.body?.userEmail || 'investigator@garuda.ai';
  const userId = req.user?.id || 'USER-AGENT';
  const entry = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    userEmail,
    action,
    target,
    timestamp: new Date().toISOString()
  };

  mockAuditLogs.unshift(entry);

  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('AuditLogs');
    await table.insertRow(entry);
  } catch (err) {
    console.log('Catalyst DB AuditLogs offline, recorded to memory');
  }
}

// 1. Transactions List
app.get('/api/transactions', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const queryResult = await datastore.table('Transactions').selectRows();
    
    const formatted = queryResult.map(row => ({
      id: row.id,
      sender: row.sender,
      senderAccount: row.senderAccount,
      receiver: row.receiver,
      receiverAccount: row.receiverAccount,
      amount: Number(row.amount),
      currency: row.currency,
      timestamp: row.timestamp,
      senderCountry: row.senderCountry,
      receiverCountry: row.receiverCountry,
      senderBank: row.senderBank,
      receiverBank: row.receiverBank,
      riskScore: Number(row.riskScore),
      status: row.status,
      aiVerdict: row.aiVerdict,
      fraudProbability: Number(row.fraudProbability),
      category: row.category
    }));
    return res.json(formatted);
  } catch (err) {
    return res.json(mockTransactions);
  }
});

// 1b. Ingest Transactions CSV
app.post('/api/transactions/ingest', async (req, res) => {
  const { fileName, fileContent } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: 'File content is required' });
  }

  const lines = fileContent.split('\n');
  if (lines.length <= 1) {
    return res.status(400).json({ error: 'File is empty' });
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const transactionsToInsert = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < headers.length) continue;

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx];
    });

    const amount = parseFloat(row.amount || row.Amount || '0');
    const sender = row.sender || row.Sender || 'Unknown Origin';
    const receiver = row.receiver || row.Receiver || 'Suspicious Beneficiary';
    const senderAccount = row.senderAccount || row.SenderAccount || `ACC-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiverAccount = row.receiverAccount || row.ReceiverAccount || `ACC-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = row.timestamp || row.Date || new Date().toISOString();
    const currency = row.currency || row.Currency || 'USD';
    const senderCountry = row.senderCountry || 'US';
    const receiverCountry = row.receiverCountry || 'US';
    const senderBank = row.senderBank || 'Local Bank';
    const receiverBank = row.receiverBank || 'Beneficiary Bank';
    const category = row.category || 'Uploaded Ingestion';

    let riskScore = Math.floor(Math.random() * 30);
    if (amount > 100000) riskScore += 40;
    if (receiverCountry !== senderCountry) riskScore += 25;

    const txId = row.id || row.id || `TX-${Math.floor(10000 + Math.random() * 90000)}`;

    transactionsToInsert.push({
      id: txId,
      sender,
      senderAccount,
      receiver,
      receiverAccount,
      amount,
      currency,
      timestamp,
      senderCountry,
      receiverCountry,
      senderBank,
      receiverBank,
      riskScore,
      status: riskScore >= 70 ? 'flagged' : 'clear',
      aiVerdict: riskScore >= 70 ? 'Anomalous offshore exposure detected.' : 'Normal transaction route.',
      fraudProbability: riskScore / 100,
      category
    });
  }

  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Transactions');
    
    for (const tx of transactionsToInsert) {
      await table.insertRow(tx);
    }
  } catch (err) {
    console.log('Catalyst DB not provisioned, appending to in-memory transactions');
    for (const tx of transactionsToInsert) {
      const exists = mockTransactions.find(t => t.id === tx.id);
      if (!exists) {
        mockTransactions.unshift(tx);
      }
    }
  }

  await logAuditEvent(req, 'STATEMENT_INGESTED', `File ${fileName || 'Statement'} (${transactionsToInsert.length} txs)`);
  return res.json({ success: true, count: transactionsToInsert.length });
});

// 2. Cases List
app.get('/api/cases', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const queryResult = await datastore.table('Cases').selectRows();
    
    const formatted = queryResult.map(row => ({
      id: row.id,
      title: row.title,
      status: row.status,
      severity: row.severity,
      assignee: row.assignee,
      createdDate: row.createdDate,
      lastUpdated: row.lastUpdated,
      description: row.description,
      totalAmount: Number(row.totalAmount),
      linkedAccounts: JSON.parse(row.linkedAccounts || '[]'),
      linkedTransactions: JSON.parse(row.linkedTransactions || '[]'),
      notes: row.notes || ''
    }));
    return res.json(formatted);
  } catch (err) {
    return res.json(mockCases);
  }
});

// 3. Update Case Notes
app.post('/api/cases/:id/notes', async (req, res) => {
  const { notes } = req.body;
  const caseId = req.params.id;
  await logAuditEvent(req, 'CASE_NOTES_UPDATED', `Case ${caseId}`);
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Cases');
    const records = await table.selectRows({ id: caseId });
    if (records && records.length > 0) {
      const record = records[0];
      record.notes = notes;
      await table.updateRow(record);
      return res.json({ success: true, notes });
    }
    return res.status(404).json({ error: 'Case not found' });
  } catch (err) {
    const matchedCase = mockCases.find(c => c.id === caseId);
    if (matchedCase) {
      matchedCase.notes = notes;
      return res.json({ success: true, notes });
    }
    return res.status(404).json({ error: 'Case not found in memory' });
  }
});

// 4. Escalate/Update Case Status
app.post('/api/cases/:id/status', async (req, res) => {
  const { status } = req.body;
  const caseId = req.params.id;
  await logAuditEvent(req, 'STATUS_ESCALATED', `Case ${caseId} set to ${status}`);
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const table = datastore.table('Cases');
    const records = await table.selectRows({ id: caseId });
    if (records && records.length > 0) {
      const record = records[0];
      record.status = status;
      await table.updateRow(record);
      return res.json({ success: true, status });
    }
    return res.status(404).json({ error: 'Case not found' });
  } catch (err) {
    const matchedCase = mockCases.find(c => c.id === caseId);
    if (matchedCase) {
      matchedCase.status = status;
      return res.json({ success: true, status });
    }
    return res.status(404).json({ error: 'Case not found in memory' });
  }
});

// 5. Get Accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const queryResult = await datastore.table('Accounts').selectRows();
    return res.json(queryResult);
  } catch (err) {
    return res.json(mockAccounts);
  }
});

// 6. Reports List
app.get('/api/reports', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const queryResult = await datastore.table('Reports').selectRows();
    return res.json(queryResult);
  } catch (err) {
    return res.json(mockReports);
  }
});

// 7. Dashboard Stats
app.get('/api/stats', (req, res) => {
  return res.json(mockStats);
});

// 8. Gemini Forensic Report Generation
app.post('/api/reports/generate', async (req, res) => {
  const { caseId, apiKey } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY;

  const matchedCase = mockCases.find(c => c.id === caseId) || mockCases[0];
  const linkedTxs = mockTransactions.filter(t => matchedCase.linkedTransactions.includes(t.id));
  const linkedAccs = mockAccounts.filter(a => matchedCase.linkedAccounts.includes(a.id));

  if (activeKey) {
    try {
      const genAI = new GoogleGenAI({ apiKey: activeKey });
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are GARUDA AI, an expert Financial Cybercrime Investigator for Cyber Crime Police and FIUs.
Analyze Case ${matchedCase.id}: "${matchedCase.title}".
Description: ${matchedCase.description}.
Total Value: $${matchedCase.totalAmount} USD.
Linked Accounts: ${linkedAccs.map(a => `${a.name} (${a.bank}, ${a.country})`).join(', ')}.
Linked Transactions: ${linkedTxs.map(t => `${t.id}: $${t.amount} ${t.currency} from ${t.sender} to ${t.receiver}`).join('; ')}.

Generate a formal forensic investigation summary.
Return ONLY raw JSON with these exact fields:
{
  "title": "A concise title",
  "summary": "Detailed executive summary of suspicious velocity, structuring, or layering behavior",
  "riskLevel": "Critical",
  "evidenceCount": 24,
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        const cleanText = text.replace(/```json|```/g, '').trim();
        const parsedReport = JSON.parse(cleanText);
        return res.json({
          id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
          caseId,
          generatedDate: new Date().toISOString().split('T')[0],
          analyst: 'GARUDA Gemini AI Intelligence Engine',
          ...parsedReport
        });
      } catch (parseErr) {
        return res.json({
          id: `RPT-GEN`,
          caseId,
          generatedDate: new Date().toISOString().split('T')[0],
          analyst: 'GARUDA Gemini AI Intelligence Engine',
          title: `Forensic Findings for ${matchedCase.title}`,
          summary: text.slice(0, 500) + '...',
          riskLevel: matchedCase.severity === 'critical' ? 'Critical' : 'High',
          evidenceCount: 18,
          recommendations: ['Freeze linked recipient accounts', 'Notify FIU and compliance officers']
        });
      }
    } catch (apiErr) {
      console.log('Gemini API call failed, generating simulated report.');
    }
  }

  const matchedReport = mockReports.find(r => r.caseId === caseId) || mockReports[0];
  return res.json({
    ...matchedReport,
    id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
    generatedDate: new Date().toISOString().split('T')[0]
  });
});

// 9. Interactive Copilot Chat
app.post('/api/chat', async (req, res) => {
  const { message, history, apiKey } = req.body;
  const activeKey = apiKey || process.env.GEMINI_API_KEY;

  if (activeKey) {
    try {
      const genAI = new GoogleGenAI({ apiKey: activeKey });
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({
        history: (history || []).map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        generationConfig: { maxOutputTokens: 250 }
      });
      const response = await chat.sendMessage(message);
      return res.json({ reply: response.response.text() });
    } catch (err) {
      console.log('Gemini Chat failed, serving mock reply');
    }
  }

  const lowerMsg = message.toLowerCase();
  let reply = "I am scanning our Data Store for structural anomalies. Could you please specify a Case Reference?";
  if (lowerMsg.includes('layering') || lowerMsg.includes('case-001')) {
    reply = "For Case CASE-001 (Operation Layering Ring), we detected a velocity pattern where ACC-5421 transferred $450,000 USD to Offshore Banking, immediately consolidated from UK and IT banks. This indicates a high-risk layering vector.";
  } else if (lowerMsg.includes('sanctions') || lowerMsg.includes('case-002')) {
    reply = "Analyzing CASE-002. Acc-3344 and Acc-6767 show immediate interactions with Russian-origin crypto exchange wallets, structuring funds to stay below standard SAR limits. Immediate asset freeze is advised.";
  } else if (lowerMsg.includes('recommend') || lowerMsg.includes('steps')) {
    reply = "Based on standard operating procedures for Karnataka Police financial investigations, the next steps are:\n1. Freeze linked recipient bank accounts.\n2. Obtain KYC IP addresses and device identifiers.\n3. File a Suspicious Activity Report (SAR) with compliance officers.";
  }
  return res.json({ reply });
});

// 10. Audit Logs List
app.get('/api/audit-logs', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const queryResult = await datastore.table('AuditLogs').selectRows();
    return res.json(queryResult);
  } catch (err) {
    return res.json(mockAuditLogs);
  }
});

module.exports = app;
