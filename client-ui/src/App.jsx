import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentGateway from './PaymentGateway';
import AdminDashboard from './AdminDashboard';

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
    <div style={styles.appContainer}>
      {/* --- THIS NAV BAR MUST BE OUTSIDE THE VIEW LOGIC --- */}
      <nav style={styles.navbar}>
        <div style={styles.brand}>AGORA-LINK</div>
        <div style={styles.navGroup}>
          <button 
            onClick={() => setView('user')} 
            style={{
              ...styles.navBtn, 
              backgroundColor: view === 'user' ? '#38bdf8' : 'transparent',
              color: view === 'user' ? '#0f172a' : 'white'
            }}
          >
            Bridge Gateway
          </button>
          
          <button 
            onClick={handleAdminAccess} 
            style={{
              ...styles.navBtn, 
              backgroundColor: view === 'admin' ? '#38bdf8' : 'transparent',
              color: view === 'admin' ? '#0f172a' : 'white'
            }}
          >
            Compliance Admin
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={styles.mainArea}>
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

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#0f172a', // Deep background
    color: 'white',
    fontFamily: '"Inter", sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 60px',
    backgroundColor: '#1e293b', // Lighter slate for the bar
    borderBottom: '2px solid #334155',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#38bdf8',
    letterSpacing: '2px',
  },
  navGroup: {
    display: 'flex',
    gap: '20px'
  },
  navBtn: {
    padding: '10px 25px',
    border: '2px solid #38bdf8',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: '0.3s',
  },
  mainArea: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  }
};

export default App;