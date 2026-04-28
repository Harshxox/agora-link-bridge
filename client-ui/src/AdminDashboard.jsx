import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch logs from our Node.js Gateway
    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/logs');
            setLogs(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching logs:", error);
            setLoading(false);
        }
    };

    // 2. Export to CSV Function for Audit Reports
    const downloadCSV = () => {
        const headers = ["Timestamp,Wallet,Amount (USD),Risk Level,Anomaly Score,Status,Blockchain Hash\n"];
        const rows = logs.map(log =>
            `${new Date(log.timestamp).toLocaleString()},${log.walletAddress},${log.fiatAmount},${log.aiRiskLevel},${log.aiAnomalyScore},${log.status},${log.txHash || 'N/A'}\n`
        );
        const blob = new Blob([headers, ...rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `Agora_Audit_Report_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    useEffect(() => {
        fetchLogs();
        // Auto-refresh data every 15 seconds
        const interval = setInterval(fetchLogs, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-title">
                    <span>🛡️</span>
                    Agora-Link | Compliance Audit Logs
                </div>
                <div className="admin-btn-group">
                    <button id="export-csv-btn" onClick={downloadCSV} className="admin-btn primary">
                        📥 Export CSV
                    </button>
                    <button id="refresh-logs-btn" onClick={fetchLogs} className="admin-btn secondary">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-empty">
                    <div className="spinner" style={{
                        width: 24, height: 24,
                        border: '2px solid transparent',
                        borderTopColor: 'var(--cyan)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    Gathering audit trails...
                </div>
            ) : logs.length === 0 ? (
                <div className="admin-empty">
                    <h3>No logs found.</h3>
                    <p>Process a transaction in the Gateway to see data here.</p>
                </div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Wallet Address</th>
                                <th>Amount (USD)</th>
                                <th>AI Risk</th>
                                <th>Status</th>
                                <th>Settlement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="address-cell">
                                        {log.walletAddress.substring(0, 12)}...
                                    </td>
                                    <td>${log.fiatAmount.toFixed(2)}</td>
                                    <td className={log.aiRiskLevel === 'LOW' ? 'risk-low' : 'risk-high'}>
                                        {log.aiRiskLevel} (Score: {log.aiAnomalyScore.toFixed(3)})
                                    </td>
                                    <td className={log.status === 'APPROVED' ? 'status-approved' : 'status-denied'}>
                                        {log.status}
                                    </td>
                                    <td>
                                        {log.txHash ? (
                                            <a
                                                href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="etherscan-link"
                                            >
                                                View on Etherscan ↗
                                            </a>
                                        ) : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;