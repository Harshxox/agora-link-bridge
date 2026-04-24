# 🚀 AGORA-LINK: Enterprise AI-Gated Fiat-to-Crypto Bridge
![Agora-Link Banner](./a_wide_cinematic_tech_crypto_banner_graphic_dark.png)

**Author:** Harshdeep Sharma  
**Version:** 1.0.0 (Stable Release)  
**Deployment:** Sepolia Testnet | MongoDB Atlas | Python ML Engine  

---

## 🌐 The Vision

Agora-Link is built to solve one of the biggest challenges in decentralized finance — **the Compliance Gap**.

Unlike traditional bridges that focus only on speed, Agora-Link prioritizes **institutional integrity**, acting as a secure, auditable, and intelligent **financial gatekeeper** between:

- Web2 Fiat Systems (Stripe)
- Web3 Liquidity (Ethereum)

It uses an **Agentic AI Compliance Engine** to ensure every transaction is verified before execution.

---

## 🏗️ System Architecture

Agora-Link follows a **multi-layered microservices architecture** for security, scalability, and real-time AML detection.

### 1. Intelligent Frontend (React + Vite)
- Dark-mode fintech UI
- Secure payment handling via Stripe Elements
- Compliance Admin Dashboard for audit monitoring

### 2. Gateway API (Node.js / Express)
- Core orchestration layer
- Connects payments, AI engine, and blockchain
- Ensures **AI Approval Token validation** before transactions

### 3. Compliance AI Engine (Python / Flask)
- ML-based anomaly detection using **Isolation Forest**
- Evaluates:
  - Transaction amount
  - Wallet age
  - Transaction frequency
- Generates real-time **Risk Score**

### 4. Audit Vault (MongoDB Atlas)
- Immutable-style logging system
- Stores both approved and rejected transactions
- Enables regulatory audit tracking

### 5. Web3 Settlement Layer (Solidity + Ethers.js)
- Smart contracts deployed via Remix IDE
- Lightweight and optimized blockchain interaction
- Secure settlement logic on Ethereum (Sepolia)

---

## 🛠️ Tech Stack

| Layer       | Technology             | Purpose                              |
|------------|----------------------|--------------------------------------|
| Frontend   | React (Vite)         | High-performance UI                  |
| Backend    | Node.js / Express    | API orchestration                    |
| AI / ML    | Python (Scikit-Learn)| Anomaly detection                    |
| Web3       | Solidity / Ethers.js | Smart contract interaction           |
| Database   | MongoDB Atlas        | Audit logging                        |
| Payments   | Stripe API           | Fiat-to-crypto processing            |

---

## 🛡️ Security Features

- **Zero-Trust AML System**
  - Transactions blocked if risk score > **0.85**

- **Environment Isolation**
  - Sensitive keys stored in `.env`
  - No exposure to version control

- **Admin Protection**
  - Secured Compliance Dashboard (password-protected)

- **On-Chain Verification**
  - Each transaction linked with a verifiable hash (Etherscan)

---

## ⚙️ Execution Guide

Run all three core services simultaneously.

---

### 1️⃣ Compliance Engine (Python)

```bash
cd compliance-engine
pip install flask flask-cors pandas scikit-learn
python app.py
```
Runs on: http://127.0.0.1:5001

### 2️⃣ Gateway API (Node.js)

```bash
cd gateway-api
npm install
node server.js
```
Runs on: http://localhost:5000

### 3️⃣ Client UI (React)

```bash
cd client-ui
npm install
npm run dev
```
Runs on: http://localhost:5173

## 📊 Administrative Dashboard
Agora-Link includes a built-in Compliance Dashboard:

📡 Real-time transaction monitoring
📜 Full audit trail from MongoDB
📤 One-click CSV export for compliance reporting

## License & Disclaimer

Developed by Harshdeep Sharma during the 2026 Advanced Fintech Sprint.

This project is intended for:

Industrial demonstration
Research and learning purposes

All smart contracts are deployed via Remix IDE for optimized gas efficiency and precision.