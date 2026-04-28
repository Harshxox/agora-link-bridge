import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentGateway from './PaymentGateway';
import AdminDashboard from './AdminDashboard';
import './App.css';

// Use your VITE public key here
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [view, setView] = useState('user');

  const handleAdminAccess = () => {
    const password = prompt("Enter Admin Security Key:");
    if (password === "admin123") {
      setView('admin');
    } else {
      alert("Access Denied!");
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, overflowX: 'hidden' }}>

      {/* === CYBER BACKGROUND LAYER === */}
      <div className="cyber-bg">
        {/* Floating Orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        {/* Circuit Lines */}
        <div className="circuit-lines">
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-line"></div>
          <div className="circuit-v"></div>
          <div className="circuit-v"></div>
          <div className="circuit-v"></div>
        </div>

        {/* Security Icons */}
        <div className="security-icon">🛡️</div>
        <div className="security-icon">🔒</div>
        <div className="security-icon">🔐</div>
        <div className="security-icon">⚡</div>
        <div className="security-icon">🛡️</div>

        {/* Particle Dots */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>

        {/* Grid Overlay */}
        <div className="grid-overlay"></div>
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
    </div>
  );
}

export default App;