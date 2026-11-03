# GARUDA AI — Financial Fraud Investigation & Multi-Hop Money Flow Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Zoho Catalyst](https://img.shields.io/badge/Zoho%20Catalyst-Serverless-orange.svg)](https://www.zoho.com/catalyst/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Generative%20AI-9b51e0.svg?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"AI-Powered Financial Fraud Investigation Platform for Tracing Multi-Hop Money Flow During the Golden Hour."**

---

## Overview

**GARUDA AI** is a specialized financial intelligence and fraud investigation platform built for financial analysts, fraud risk investigators, and Law Enforcement Agencies (LEAs). The application is optimized for **"The Golden Hour"**—the critical time window immediately following an unauthorized transaction when stolen funds can still be traced, localized across intermediary bank hops, and frozen before siphoning into cryptocurrency or offshore accounts.

By leveraging automated transactional graph traversal and Google Gemini LLMs, GARUDA AI reconstructs complex multi-hop fund routing, evaluates entity threat scores, and generates legally compliant investigation notices (such as Section 91 CrPC notices) in seconds.

---

## Key Features

- **Real-Time Incident Command Center**: Dynamic monitoring tracking Scammed Amount, Active Incidents, High-Risk Accounts, and Freezable Funds.
- **Golden Hour Alert Matrix**: Instant prioritized guidance directing investigators to the fastest actionable recovery pathways.
- **Multi-Hop Transaction Graph**: Visual graph traversal mapping the flow of illicit capital from victim accounts through mule layers to final cashout endpoints.
- **AI-Powered Legal Notice Generation**: Automatically formats and populates legal bank freeze notices and Section 91 directives via Google Gemini API.
- **Entity Threat Scoring**: Heuristic and probabilistic risk scoring identifying mule accounts, transaction layering velocity, and burst transfers.
- **Automated Case Dossier Export**: Compiles forensic evidence, transaction histories, and visual maps into audit-ready PDF/CSV reports.

---

## Architecture & Tech Stack

```
[Victim Fraud Report / Bank Ingestion]
                     │
                     ▼
[Zoho Catalyst Serverless Backend]
  ├── Multi-Hop Graph Traversal Engine
  ├── Velocity & Anomaly Vector Evaluator
  └── Relational Schema Operations (database_schema.json)
                     │
                     ▼
[Google Gemini Generative AI Engine]
  ├── Entity Context Summarization
  └── Automated Legal Notice Drafting (Sec 91 CrPC)
                     │
                     ▼
[React 19 / TypeScript / Vite Client]
  ├── Interactive Multi-Hop Graph Canvas
  ├── Real-time Analytics Visualizations (Recharts)
  └── Case File Evidence Vault
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Zoho Catalyst Serverless Functions (Node.js / Express)
- **AI Engine**: Google Gemini API for automated legal compliance drafting
- **Database**: Catalyst Data Store / Relational Schema (`database_schema.json`)

---

## Project Structure

```
garuda_ai/
├── client/                     # React 19 + TypeScript frontend application
│   ├── src/
│   │   ├── components/         # Graph visualizer, alert panels, case cards
│   │   ├── services/           # API and Catalyst SDK integrations
│   │   └── App.tsx             # Root dashboard
│   ├── package.json
│   └── vite.config.ts
├── functions/                  # Zoho Catalyst serverless backend functions
├── catalyst.json               # Catalyst deployment configuration
├── database_schema.json        # Relational entity-relationship fraud schema
├── .env.example                # Environment variables template
├── .gitignore                  # Exclusion rules
└── README.md                   # Project documentation
```

---

## Installation & Setup

### Prerequisites

- Node.js (v18.x or v20.x)
- npm or yarn
- Zoho Catalyst CLI (`npm install -g zcatalyst-cli`)
- Google Gemini API Key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pratapashanmukhi/garuda_ai.git
   cd garuda_ai
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Populate your GEMINI_API_KEY and Catalyst identifiers
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Start Catalyst functions (optional for local backend testing):**
   ```bash
   cd ..
   catalyst serve
   ```

---

## Author

**Shanmukhi Pratapa**  
B.Tech CSE (AI & ML) — VIT-AP University  
GitHub: [@pratapashanmukhi](https://github.com/pratapashanmukhi)
