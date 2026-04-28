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
  const [walletAge, setWalletAge] = useState('365'); // Default 1 year old
  const [txFrequency, setTxFrequency] = useState('Low'); // Default safe frequency

  // UI Status State
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setStatus('1/4: Tokenizing Credit Card...');
      const cardElement = elements.getElement(CardElement);

      // Securely create the Stripe token
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) throw new Error(error.message);

      setStatus('2/4: Processing Fiat Payment & Running AI AML Check...');

      // --- FIX: Translate the UI string into a number for the AI ---
      let freqNum = 1; // Default to Low
      if (txFrequency === 'Medium') freqNum = 5;
      if (txFrequency === 'High') freqNum = 10;
      // ----------------------------------------------------------------

      // Fire the payload to your Node.js server with the dynamic AI data!
      const response = await axios.post('http://127.0.0.1:5000/process-payment', {
        amount: amount,
        walletAddress: walletAddress,
        paymentMethodId: paymentMethod.id,
        walletAge: Number(walletAge), // Sent dynamically from UI
        txFrequency: freqNum          // Sent securely as a NUMBER!
      });

      setStatus('3/4: AI Approved. Settling on Blockchain...');

      if (response.data.success) {
        setStatus('4/4: Success! Transaction Complete.');
        setTxHash(response.data.blockchain_hash); // Save the hash for the Etherscan receipt
      }

    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.message || err.response?.data?.message || err.response?.data?.error}`);
    }
  };

  return (
    <div className="gateway-container">
      <h2>Fiat-to-Crypto Bridge</h2>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label>Amount (ETH to Buy)</label>
          <input type="number" step="0.001" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Destination Wallet Address</label>
          <input type="text" placeholder="0x..." value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required />
        </div>

        {/* --- AI DEMO FIELDS --- */}
        <div className="input-group">
          <label>Wallet Age (Days)</label>
          <input type="number" value={walletAge} onChange={(e) => setWalletAge(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Transaction Frequency</label>
          <select value={txFrequency} onChange={(e) => setTxFrequency(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#fff', border: '1px solid #ccc', color: '#000' }} required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {/* ----------------------------- */}

        <div className="input-group">
          <label>Credit Card Info</label>
          <div className="stripe-card-element">
            <CardElement options={{ style: { base: { fontSize: '16px', color: '#ffffff', '::placeholder': { color: '#888888' } } } }} />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={!stripe}>
          Process Payment
        </button>
      </form>

      {/* Dynamic Status and Receipt UI */}
      {status && (
        <div style={{ marginTop: '20px', color: status.includes('Error') || status.includes('❌') ? '#ff4d4d' : '#4CAF50', textAlign: 'center', fontWeight: 'bold' }}>
          {status}
        </div>
      )}

      {txHash && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#2a2a2a', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#aaaaaa' }}>Etherscan Receipt:</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4da6ff', textDecoration: 'none', wordBreak: 'break-all' }}
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;