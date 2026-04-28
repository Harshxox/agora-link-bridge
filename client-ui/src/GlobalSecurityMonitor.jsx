import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GlobalSecurityMonitor.css';

const GlobalSecurityMonitor = () => {
  const [cleared, setCleared] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [latency, setLatency] = useState(0);

  // Fetch real data from Node.js backend
  const fetchStats = async () => {
    const startTime = Date.now();
    try {
      const response = await axios.get('http://localhost:5000/admin/stats');
      setCleared(response.data.approved);
      setBlocked(response.data.rejected);
      // Calculate real latency based on request time
      setLatency(Date.now() - startTime);
    } catch (error) {
      console.error("Error fetching network stats:", error);
      // Keep previous data but show error latency
      setLatency(999);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Poll every 5 seconds
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);


  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="gsm-wrapper" id="global-security-monitor">
      <div className="gsm-panel">
        {/* Internal grid lines flair */}
        <div className="gsm-grid-lines"></div>

        {/* Specular sweep */}
        <div className="gsm-specular"></div>

        {/* === HEADER === */}
        <div className="gsm-header">
          <div className="gsm-header-left">
            <span className="gsm-header-icon">◈</span>
            <span className="gsm-header-title">AGORA-LINK NETWORK HEALTH</span>
          </div>
          <div className="gsm-live-dot-wrap">
            <span className="gsm-live-dot"></span>
            <span className="gsm-live-text">LIVE</span>
          </div>
        </div>

        <div className="gsm-divider"></div>

        {/* === METRICS === */}
        <div className="gsm-metrics">
          {/* Cleared Transactions */}
          <div className="gsm-metric gsm-metric-cleared">
            <div className="gsm-metric-label">
              <span className="gsm-metric-label-icon">✓</span>
              Total Cleared
            </div>
            <div className="gsm-metric-value gsm-value-green">
              <svg className="gsm-icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {formatNumber(cleared)}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="gsm-metric-sep"></div>

          {/* Anomalies Blocked */}
          <div className="gsm-metric gsm-metric-blocked">
            <div className="gsm-metric-label">
              <span className="gsm-metric-label-icon">⚠️</span>
              Anomalies Blocked
            </div>
            <div className="gsm-metric-value gsm-value-red">
              <svg className="gsm-icon-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {formatNumber(blocked)}
            </div>
          </div>
        </div>

        <div className="gsm-divider"></div>

        {/* === FOOTER === */}
        <div className="gsm-footer">
          <span className="gsm-footer-bracket">[</span>
          SYNCING VIA MONGODB AT {latency}ms
          <span className="gsm-footer-bracket">]</span>
        </div>
      </div>

      {/* 3D thickness edges */}
      <div className="gsm-edge-bottom"></div>
      <div className="gsm-edge-right"></div>
    </div>
  );
};

export default GlobalSecurityMonitor;
