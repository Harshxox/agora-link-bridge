import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentGateway from './PaymentGateway';
import AdminDashboard from './AdminDashboard';
import GlobalSecurityMonitor from './GlobalSecurityMonitor';
import './App.css';

// Use your VITE public key here
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [view, setView] = useState('user');
  const [darkMode, setDarkMode] = useState(true);

  // Sync theme class to body so body bg + scrollbar also switch
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const handleAdminAccess = () => {
    const password = prompt("Enter Admin Security Key:");
    if (password === "admin123") {
      setView('admin');
    } else {
      alert("Access Denied!");
    }
  };

  return (
    <div className={darkMode ? '' : 'light-mode'} style={{ minHeight: '100vh', position: 'relative', zIndex: 1, overflowX: 'hidden' }}>

      {/* === ANIMATED BACKGROUND LAYER (Agorax-style) === */}
      <div className="cyber-bg">
        {/* Soft Orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        {/* Grid Overlay */}
        <div className="grid-overlay"></div>

        {/* === DIAGONAL FLOATING DATA CARDS (Isometric Grid) === */}
        <div className="diagonal-scroll-layer">
          {/* Row 1 */}
          <div className="float-card fc-1">
            <div className="fc-header"><span className="fc-dot fc-dot-green"></span>TX_VERIFIED</div>
            <div className="fc-body">0x7a3f...e9c1</div>
            <div className="fc-footer">0.045 ETH → Bridge</div>
          </div>
          <div className="float-card fc-2">
            <div className="fc-header"><span className="fc-dot fc-dot-neon"></span>AML_CLEAR</div>
            <div className="fc-body">Risk: LOW</div>
            <div className="fc-footer">Score: 0.012</div>
          </div>
          <div className="float-card fc-3">
            <div className="fc-header"><span className="fc-dot fc-dot-purple"></span>COMPLIANCE</div>
            <div className="fc-body">KYC Passed</div>
            <div className="fc-footer">Region: US-EAST</div>
          </div>
          {/* Row 2 */}
          <div className="float-card fc-4">
            <div className="fc-header"><span className="fc-dot fc-dot-red"></span>ANOMALY_FLAG</div>
            <div className="fc-body">Pattern: Spike</div>
            <div className="fc-footer">Blocked → Review</div>
          </div>
          <div className="float-card fc-5">
            <div className="fc-header"><span className="fc-dot fc-dot-green"></span>SETTLEMENT</div>
            <div className="fc-body">Confirmed ✓</div>
            <div className="fc-footer">Block #19284756</div>
          </div>
          <div className="float-card fc-6">
            <div className="fc-header"><span className="fc-dot fc-dot-neon"></span>VAULT_LOCK</div>
            <div className="fc-body">Encrypted</div>
            <div className="fc-footer">AES-256-GCM</div>
          </div>
          {/* Row 3 */}
          <div className="float-card fc-7">
            <div className="fc-header"><span className="fc-dot fc-dot-green"></span>NODE_SYNC</div>
            <div className="fc-body">Latency: 42ms</div>
            <div className="fc-footer">Sepolia Testnet</div>
          </div>
          <div className="float-card fc-8">
            <div className="fc-header"><span className="fc-dot fc-dot-neon"></span>ML_ENGINE</div>
            <div className="fc-body">Model v3.2</div>
            <div className="fc-footer">Accuracy: 99.7%</div>
          </div>
          <div className="float-card fc-9">
            <div className="fc-header"><span className="fc-dot fc-dot-purple"></span>SMART_CTR</div>
            <div className="fc-body">AgoraVault.sol</div>
            <div className="fc-footer">Gas: 0.003 ETH</div>
          </div>
          {/* Row 4 */}
          <div className="float-card fc-10">
            <div className="fc-header"><span className="fc-dot fc-dot-green"></span>AUDIT_LOG</div>
            <div className="fc-body">Entries: 1,247</div>
            <div className="fc-footer">Last: 2s ago</div>
          </div>
          <div className="float-card fc-11">
            <div className="fc-header"><span className="fc-dot fc-dot-red"></span>SHIELD_UP</div>
            <div className="fc-body">Firewall Active</div>
            <div className="fc-footer">DDoS Protected</div>
          </div>
          <div className="float-card fc-12">
            <div className="fc-header"><span className="fc-dot fc-dot-neon"></span>ORACLE_FEED</div>
            <div className="fc-body">ETH: $3,847</div>
            <div className="fc-footer">Chainlink v2</div>
          </div>
        </div>

        {/* === SIGNAL RING PULSES === */}
        <div className="signal-ring sr-1"></div>
        <div className="signal-ring sr-2"></div>
        <div className="signal-ring sr-3"></div>
        <div className="signal-ring sr-4"></div>

        {/* === HORIZONTAL DATA STREAMS === */}
        <div className="data-stream ds-1"></div>
        <div className="data-stream ds-2"></div>
        <div className="data-stream ds-3"></div>
        <div className="data-stream ds-4"></div>
        <div className="data-stream ds-5"></div>

        {/* === VERTICAL DATA STREAMS === */}
        <div className="data-stream-v dsv-1"></div>
        <div className="data-stream-v dsv-2"></div>
        <div className="data-stream-v dsv-3"></div>

        {/* === FLOATING NODE DOTS === */}
        <div className="node-dot nd-1"></div>
        <div className="node-dot nd-2"></div>
        <div className="node-dot nd-3"></div>
        <div className="node-dot nd-4"></div>
        <div className="node-dot nd-5"></div>
        <div className="node-dot nd-6"></div>
        <div className="node-dot nd-7"></div>
        <div className="node-dot nd-8"></div>

        {/* === HEX GRID PATTERN === */}
        <div className="hex-pattern"></div>
      </div>

      {/* === GLASSMORPHISM NAVBAR === */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">⬡</div>
          <span className="brand-text">AGORA-LINK</span>
          <span className="brand-tag">V2.0</span>
        </div>

        <div className="nav-group">
          <div className="nav-status">
            <span className="pulse-dot"></span>
            SYSTEM ONLINE
          </div>

          <button
            id="nav-bridge-btn"
            onClick={() => setView('user')}
            className={`nav-btn ${view === 'user' ? 'active' : ''}`}
          >
            ◈ Bridge Gateway
          </button>

          <button
            id="nav-admin-btn"
            onClick={handleAdminAccess}
            className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
          >
            ◇ Compliance Admin
          </button>

          <button
            id="nav-theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="nav-btn theme-toggle-btn"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀' : '☾'}
          </button>
        </div>
      </nav>

      {/* === MAIN CONTENT === */}
      <main className="main-area">
        {view === 'user' ? (
          <Elements stripe={stripePromise}>
            <PaymentGateway />
          </Elements>
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* === GLOBAL SECURITY MONITOR (Bottom-Left HUD) === */}
      <GlobalSecurityMonitor />
    </div>
  );
}

export default App;