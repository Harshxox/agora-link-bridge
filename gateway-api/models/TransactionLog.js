const mongoose = require('mongoose');

const TransactionLogSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    fiatAmount: { type: Number, required: true },
    aiRiskLevel: { type: String, required: true },
    aiAnomalyScore: { type: Number, required: true },
    status: { type: String, enum: ['APPROVED', 'REJECTED', 'FAILED'], required: true },
    txHash: { type: String, default: null }, // Will be null if rejected by AI
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransactionLog', TransactionLogSchema);