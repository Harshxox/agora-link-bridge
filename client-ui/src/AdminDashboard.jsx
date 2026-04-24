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
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Agora-Link | Compliance Audit Logs</h2>
                <div>
                    <button onClick={downloadCSV} style={styles.exportBtn}>📥 Export CSV</button>
                    <button onClick={fetchLogs} style={styles.refreshBtn}>🔄 Refresh</button>
                </div>
            </div>

            {loading ? (
                <div style={styles.emptyState}>Gathering audit trails...</div>
            ) : logs.length === 0 ? (
                <div style={styles.emptyState}>
                    <h3>No logs found.</h3>
                    <p>Process a transaction in the Gateway to see data here.</p>
                </div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
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
                                <tr key={log._id} style={styles.row}>
                                    <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td style={{...styles.td, ...styles.address}}>{log.walletAddress.substring(0, 12)}...</td>
                                    <td style={styles.td}>${log.fiatAmount.toFixed(2)}</td>
                                    <td style={{
                                        ...styles.td, 
                                        color: log.aiRiskLevel === 'LOW' ? '#4ade80' : '#f87171',
                                        fontWeight: 'bold'
                                    }}>
                                        {log.aiRiskLevel} (Score: {log.aiAnomalyScore.toFixed(3)})
                                    </td>
                                    <td style={{
                                        ...styles.td, 
                                        color: log.status === 'APPROVED' ? '#4ade80' : '#ef4444', 
                                        fontWeight: 'bold'
                                    }}>
                                        {log.status}
                                    </td>
                                    <td style={styles.td}>
                                        {log.txHash ? (
                                            <a 
                                                href={`https://sepolia.etherscan.io/tx/${log.txHash}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                style={styles.link}
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

const styles = {
    container: { padding: '40px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '24px', color: '#38bdf8', fontWeight: 'bold' },
    refreshBtn: { padding: '10px 20px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', marginLeft: '10px' },
    exportBtn: { padding: '10px 20px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    tableWrapper: { backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    tableHeader: { backgroundColor: '#334155', height: '50px', fontSize: '14px', textTransform: 'uppercase' },
    td: { padding: '15px', borderBottom: '1px solid #334155', fontSize: '14px' },
    row: { transition: 'background 0.2s', ':hover': { backgroundColor: '#2d3748' } },
    address: { fontFamily: 'monospace', color: '#94a3b8' },
    link: { color: '#38bdf8', textDecoration: 'none' },
    emptyState: { textAlign: 'center', padding: '100px', color: '#94a3b8' }
};

export default AdminDashboard;