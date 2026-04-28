const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

// Load the ABI from the file you saved in Step 4
const vaultAbi = JSON.parse(fs.readFileSync('./AgoraVault_ABI.json', 'utf8'));

// Connect to the Sepolia Network
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Connect your Wallet securely using the Private Key
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Connect to the specific Contract Address
const contractAddress = process.env.CONTRACT_ADDRESS;
const vaultContract = new ethers.Contract(contractAddress, vaultAbi, wallet);

/**
 * Triggers the settlement on the blockchain.
 * @param {string} recipientAddress - The wallet address getting paid.
 * @param {string} amountInEth - The amount to send (e.g., "0.01").
 * @param {string} txId - The unique transaction ID.
 */
async function processBlockchainSettlement(recipientAddress, amountInEth, txId) {
    try {
        console.log(`[Web3] Initiating settlement for TX: ${txId}...`);

        // Convert the human-readable ETH amount to Wei (machine format)
        const amountInWei = ethers.parseEther(amountInEth);

        // Ensure the txId is a 32-byte hash (required by your smart contract)
        const formattedTxId = ethers.id(txId);

        // First, explicitly pass the compliance check (Owner only)
        console.log("[Web3] Setting compliance status to true...");
        const complianceTx = await vaultContract.setComplianceStatus(formattedTxId, true);
        await complianceTx.wait();

        // Second, trigger the actual payment
        console.log(`[Web3] Sending ${amountInEth} ETH to ${recipientAddress}...`);
        const settlementTx = await vaultContract.settlePayment(recipientAddress, amountInWei, formattedTxId);

        // Wait for the block to be mined
        const receipt = await settlementTx.wait();

        console.log(`[Web3] SUCCESS! Transaction Hash: ${receipt.hash}`);
        return receipt.hash;

    } catch (error) {
        console.error("[Web3 Error] Settlement failed:", error.reason || error.message);
        throw error;
    }
}

// Export the function using CommonJS so server.js can read it
module.exports = { processBlockchainSettlement };