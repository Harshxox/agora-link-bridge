import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentGateway = () => {
  const stripe = useStripe();
  const elements = useElements();

  // Basic Payment State
  const [amount, setAmount] = useState('0.01');
  const [walletAddress, setWalletAddress] = useState('');

  // AI Compliance State
  const [walletAge, setWalletAge] = useState('365');
  const [txFrequency, setTxFrequency] = useState('Low');

  // UI Status State
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Reset status for new attempt
    setTxHash(null);
    setStatus('');

    try {
      setStatus('1/4: Tokenizing Credit Card...');
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) throw new Error(error.message);

      setStatus('2/4: Processing Fiat Payment & Running AI AML Check...');

      // Convert UI string to AI-ready number
      let freqNum = 1;
      if (txFrequency === 'Medium') freqNum = 5;
      if (txFrequency === 'High') freqNum = 10;

      // Call Node.js Gateway
      const response = await axios.post('http://127.0.0.1:5000/process-payment', {
        amount: amount,
        walletAddress: walletAddress,
        paymentMethodId: paymentMethod.id,
        walletAge: Number(walletAge),
        txFrequency: freqNum
      });

      setStatus('3/4: AI Approved. Settling on Blockchain...');

      if (response.data.success) {
        setStatus('4/4: Success! Transaction Complete.');
        setTxHash(response.data.blockchain_hash);
      }

    } catch (err) {
      console.error(err);

      // NEW: Extracting the specific AI rejection reason
      const rejectionReason = err.response?.data?.message || err.response?.data?.error || err.message;

      // Update status with the dynamic reason (e.g., "❌ Blocked by AI: High Risk")
      setStatus(`❌ ERROR: ${rejectionReason}`);
    }
  };

  // Helper variables for dynamic styling
  const isError = status.includes('ERROR') || status.includes('❌');
  const isSuccess = status.includes('Success') || status.includes('✓');
  const isProcessing = status && !isError && !isSuccess;

  return (
    <div className="gateway-container">
      {/* --- 3D FLOATING ELEMENTS --- */}
      <div className="floating-badges">
        <div className="floating-badge compliance">
          <span className="badge-dot green"></span>
          COMPLIANCE: ACTIVE
        </div>
        <div className="floating-badge status">
          <span className="badge-dot cyan"></span>
          AML ENGINE: READY
        </div>
      </div>

      {/* --- MAIN GLASS SLAB CARD --- */}
      <div className="glass-slab">
        <div className="scan-line"></div>

        <div className="card-header">
          <h1>
            <span className="header-icon">◈</span>
            Fiat-to-Crypto Bridge
          </h1>
          <div className="subtitle">Secure AI-Gated Protocol</div>
        </div>

        <div className="card-divider"></div>

        <form onSubmit={handleSubmit} id="payment-form">
          {/* Amount Input */}
          <div className="input-group">
            <label><span className="label-icon">💎</span> Amount (ETH to Buy)</label>
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              required
            />
          </div>

          {/* Wallet Input */}
          <div className="input-group">
            <label><span className="label-icon">📡</span> Destination Wallet Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
            />
          </div>

          {/* AI Compliance Section */}
          <div className="ai-section-header">
            <span className="ai-icon">🧠</span>
            <span className="ai-text">AI COMPLIANCE PARAMETERS</span>
            <span className="ai-tag">ML v3.2</span>
          </div>

          <div className="input-group">
            <label><span className="label-icon">⏱️</span> Wallet Age (Days)</label>
            <input
              type="number"
              value={walletAge}
              onChange={(e) => setWalletAge(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label><span className="label-icon">📊</span> Transaction Frequency</label>
            <select
              value={txFrequency}
              onChange={(e) => setTxFrequency(e.target.value)}
              required
            >
              <option value="Low">Low — Normal Activity</option>
              <option value="Medium">Medium — Moderate Activity</option>
              <option value="High">High — Intensive Activity</option>
            </select>
          </div>

          {/* Credit Card Input */}
          <div className="input-group">
            <label><span className="label-icon">💳</span> Credit Card Info</label>
            <div className="stripe-card-element">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '15px',
                      color: '#f1f5f9',
                      fontFamily: '"Inter", sans-serif',
                      '::placeholder': { color: '#64748b' },
                    },
                  },
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : '◈ INITIALIZE SETTLEMENT'}
          </button>
        </form>

        {/* --- DYNAMIC STATUS DISPLAY --- */}
        {status && (
          <div className={`status-display ${isError ? 'error' : isSuccess ? 'success' : 'processing'}`}>
            {isProcessing && <div className="spinner"></div>}
            {status}
          </div>
        )}

        {/* --- BLOCKCHAIN RECEIPT --- */}
        {txHash && (
          <div className="tx-receipt">
            <div className="receipt-label">◈ BLOCKCHAIN RECEIPT</div>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>

      {/* Decorative 3D Card thickness edge */}
      <div className="card-edge-right"></div>
    </div>
  );
};

export default PaymentGateway;