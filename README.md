# GARUDA AI - Financial Fraud Investigation & Multi-Hop Money Flow Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Zoho Catalyst](https://img.shields.io/badge/Zoho%20Catalyst-Serverless-orange.svg)](https://www.zoho.com/catalyst/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Generative%20AI-9b51e0.svg?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"AI-Powered Financial Fraud Investigation Platform for Tracing Multi-Hop Money Flow During the Golden Hour."**

---

## Project Overview

**GARUDA AI** is an enterprise-grade financial intelligence and cyber-fraud investigation platform engineered for financial forensic analysts, fraud risk officers, and Law Enforcement Agencies (LEAs). The application is optimized specifically for **"The Golden Hour"**—the critical initial time window immediately following an unauthorized financial transaction when stolen funds can still be actively traced across intermediary banking hops and frozen before liquidation into peer-to-peer crypto exchanges or offshore accounts.

By coupling real-time transactional graph traversal with Google Gemini Generative AI, GARUDA AI reconstructs multi-hop layering paths, computes entity risk scores, and drafts legally compliant notices (such as Section 91 CrPC freeze directives) in seconds.

### Problem Statement
- **Layering Velocity**: Cyber fraudsters rapidly split and transfer stolen funds across 5–10 mule bank accounts within 30 minutes to obfuscate the paper trail.
- **Inter-Bank Friction**: Each intermediary banking institution operates independently, requiring manual phone calls or email dispatches that take days.
- **Administrative Bottlenecks**: Drafting formal legal freeze notices and regulatory dossiers manually delays asset recovery until after cash-out occurs.

---

## Key Features

- **Golden Hour Incident Command**: Live dashboard tracking Total Scammed Volume, Active Cases, Compromised Accounts, and Real-Time Freezable Balances.
- **Multi-Hop Money Flow Graph**: Interactive canvas visualizing the topological journey of stolen capital from origin victim accounts through intermediary mule tiers to final liquidation sinks.
- **AI-Powered Legal Notice Generator**: Integrates Google Gemini API to dynamically generate jurisdiction-compliant bank freeze directives and Section 91 CrPC notices.
- **Entity Threat Scoring & Anomaly Detection**: Algorithmic scoring evaluating transaction velocity, burst deposits, account dormancy reversal, and shell characteristics.
- **Relational Fraud Data Engine**: Purpose-built schema tracking `Cases`, `Transactions`, `Accounts`, and `Reports` on Zoho Catalyst Serverless infrastructure.
- **Role-Based Access Control (RBAC)**: Secure multi-tier authentication accommodating Administrators, Investigators, Read-only Analysts, Bank Officers, and Auditors.

---

## Architecture & Workflow

```
[ Victim Fraud Ingestion / Bank Telemetry ]
                     │
                     ▼
  [ Zoho Catalyst Serverless Functions (functions/garuda_backend) ]
   ├── Authentication & RBAC (bcryptjs + JWT)
   ├── Multi-Hop Graph Traversal Engine
   ├── Velocity & Transaction Anomaly Evaluator
   └── Relational Data Store (Transactions, Accounts, Cases, Reports)
                     │
                     ▼
  [ Google Gemini Generative AI Engine ]
   ├── Threat Dossier Summarization
   └── Automated Legal Freeze Notice Generation (Sec 91 CrPC)
                     │
                     ▼
  [ React 19 / TypeScript / Vite Client (client/) ]
   ├── Real-Time Multi-Hop Graph Canvas
   ├── Interactive Analytics Visualizations (Recharts)
   └── Case Management & Evidence Vault
```

---

## Project Structure

```
garuda_ai/
├── client/                     # React 19 + TypeScript frontend application
│   ├── src/
│   │   ├── components/         # Interactive graph canvas, alerts, case dossier
│   │   ├── services/           # REST API & Catalyst client connectors
│   │   ├── App.tsx             # Root dashboard controller
│   │   └── main.tsx            # Client entrypoint
│   ├── package.json            # Frontend dependencies (React 19, Lucide, Recharts)
│   └── vite.config.ts          # Vite build configuration
├── functions/                  # Zoho Catalyst serverless backend
│   └── garuda_backend/
│       ├── index.js            # Express API, Gemini AI integration, auth handlers
│       └── package.json        # Backend dependencies (zcatalyst-sdk, express, gemini)
├── database_schema.json        # Relational schema (Transactions, Cases, Accounts, Reports)
├── catalyst.json               # Catalyst serverless deployment manifest
├── .catalystrc                 # Project environment metadata
├── .env.example                # Configuration template
├── .gitignore                  # Exclusion rules
└── README.md                   # Comprehensive documentation
```

---

## Getting Started

### Prerequisites

- Node.js (`v18.x` or `v20.x` recommended)
- `npm` or `pnpm`
- Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))
- Zoho Catalyst CLI (`npm install -g zcatalyst-cli` for cloud deployment)

### 1. Environment Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Configure your credentials:
```env
CATALYST_PROJECT_ID=your_catalyst_project_id
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3000
NODE_ENV=development
```

### 2. Frontend Setup (React Client)

```bash
cd client
npm install
npm run dev
```
*The frontend dashboard will be available at `http://localhost:5173`.*

### 3. Backend Setup (Catalyst Functions)

In a separate terminal:

```bash
cd functions/garuda_backend
npm install
node index.js
```
*Or run locally via the Catalyst emulator:*
```bash
catalyst serve
```

---

## Database Architecture

The platform operates on a validated relational schema (`database_schema.json`):
- **`Cases`**: Unique incident records, victim metadata, fraud classification, and golden hour countdowns.
- **`Accounts`**: Flagged financial nodes, risk scores, KYC state, and bank affiliation.
- **`Transactions`**: Directional edges, timestamps, monetary amounts, and hop depths.
- **`Reports`**: Audit logs, evidence packages, and generated legal notice artifacts.

---

## Author

**Shanmukhi Pratapa**  
B.Tech Computer Science & Engineering (Artificial Intelligence & Machine Learning)  
VIT-AP University  
GitHub: [@pratapashanmukhi](https://github.com/pratapashanmukhi)
