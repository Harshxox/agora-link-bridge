const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Allows React frontend to talk to Node
require('dotenv').config();

// --- NEW DAY 8: MongoDB Setup ---
const mongoose = require('mongoose');
const TransactionLog = require('./models/TransactionLog');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('📦 Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// 1. Import the Blockchain Service we created
const { processBlockchainSettlement } = require('./web3Service.js');

// Initialize Stripe with your Secret Key from .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

const app = express();
app.use(express.json());
app.use(cors()); // Open the gates for localhost:5173

const PORT = 5000;
const AI_ENGINE_URL = "http://127.0.0.1:5001/analyze";

// Payment Processing Endpoint
app.post('/process-payment', async (req, res) => {
    // Destructuring exactly what the React frontend sends
    const { amount, walletAge, txFrequency, walletAddress, paymentMethodId } = req.body;

    console.log(`\n==============================================`);
    console.log(`[Gateway] Processing fiat-to-crypto request for: ${walletAddress}`);

    try {
        // --- STEP 1: Process Fiat Payment via Stripe ---
        console.log(`[Stripe] 1. Charging fiat card via Stripe...`);
        
        // Mock exchange rate (1 ETH = $3000 USD)
        const MOCK_ETH_PRICE_USD = 3000;

        // Calculate the fiat total (e.g., 0.01 ETH * $3000 = $30.00)
        const fiatTotalUSD = amount * MOCK_ETH_PRICE_USD;

        // Convert to cents for Stripe (e.g., $30.00 * 100 = 3000 cents)
        const stripeAmountInCents = Math.round(fiatTotalUSD * 100);

        console.log(`[Stripe] Calculated Fiat Price: $${fiatTotalUSD} (${stripeAmountInCents} cents)`);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: stripeAmountInCents,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });
        console.log(`[Stripe] ✅ Fiat Payment Successful! ID: ${paymentIntent.id}`);


        // --- STEP 2: Call the Python AI Compliance Engine ---
        console.log(`[Compliance] 2. Running AI AML Check...`);
        const aiResponse = await axios.post(AI_ENGINE_URL, {
            amount: amount,
            wallet_age: walletAge, 
            frequency: txFrequency  
        });

        const { status, risk_level, anomaly_score } = aiResponse.data;

        // --- STEP 3: Compliance Check Logic ---
        if (status === "FLAGGED") {
            console.log(`[Compliance] ❌ REJECTED: Risk Score ${anomaly_score}`);
            
            // --- NEW DAY 8: Save Rejected Log to Database ---
            await TransactionLog.create({
                walletAddress: walletAddress,
                fiatAmount: fiatTotalUSD, 
                aiRiskLevel: risk_level,
                aiAnomalyScore: anomaly_score,
                status: 'REJECTED'
            });

            return res.status(403).json({
                success: false,
                message: "Transaction blocked by Agora-Link AML Engine.",
                risk_level
            });
        }

        // --- STEP 4: If Approved - Trigger Smart Contract Settlement ---
        console.log(`[Compliance] ✅ APPROVED: Contacting Smart Contract Vault on Sepolia...`);

        // Generate a unique ID for this blockchain transaction record
        const internalTxId = `TX-${Date.now()}`;

        try {
            // This calls your web3Service.js to move real test ETH
            const txHash = await processBlockchainSettlement(
                walletAddress, 
                amount.toString(), 
                internalTxId
            );

            console.log(`[Blockchain] ⛓️ SETTLED: Hash ${txHash}`);

            // --- NEW DAY 8: Save Approved Log to Database ---
            await TransactionLog.create({
                walletAddress: walletAddress,
                fiatAmount: fiatTotalUSD,
                aiRiskLevel: risk_level,
                aiAnomalyScore: anomaly_score,
                status: 'APPROVED',
                txHash: txHash
            });

            // --- STEP 5: Send the Final Success Response to React ---
            res.status(200).json({
                success: true,
                message: "Fiat processed, AI approved, and Crypto settled on-chain.",
                blockchain_hash: txHash,
                details: aiResponse.data
            });

        } catch (web3Error) {
            console.error("[Blockchain Error] Settlement failed:", web3Error.message);
            
            // --- NEW DAY 8: Save Failed Blockchain Attempt ---
            await TransactionLog.create({
                walletAddress: walletAddress,
                fiatAmount: fiatTotalUSD,
                aiRiskLevel: risk_level,
                aiAnomalyScore: anomaly_score,
                status: 'FAILED'
            });

            res.status(500).json({ 
                success: false, 
                message: "Fiat processed & AI Approved, but Blockchain settlement failed. Check Vault balance.",
                error: web3Error.message 
            });
        }

    } catch (error) {
        console.error("[Error] Pipeline Failed:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal Gateway Error. Check if Stripe Keys are valid and Python Flask is running." 
        });
    }
});

// --- NEW DAY 8: ADMIN ENDPOINT: Fetch all compliance logs ---
app.get('/admin/logs', async (req, res) => {
    try {
        const logs = await TransactionLog.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error("Database fetch error:", error);
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`Agora-Link Gateway running on http://127.0.0.1:${PORT}`);
    console.log(`Status: Connected to Stripe, AI Engine, and Blockchain`);
    console.log(`==============================================`);
});