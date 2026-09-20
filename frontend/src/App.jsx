import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // Fetch alerts from Flask backend every 2 seconds (unless paused)
  useEffect(() => {
    if (isPaused) return;

    const fetchAlerts = () => {
      fetch('http://localhost:5000/api/alerts')
        .then(res => res.json())
        .then(data => setAlerts(data))
        .catch(err => console.error('Error fetching alerts:', err));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Export logs utility function
  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nids_security_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter alerts based on search term (Source IP or Severity)
  const filteredAlerts = alerts.filter(alert => 
    alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate KPI metrics
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumCount = alerts.filter(a => a.severity === 'MEDIUM').length;

  // Format data for Recharts
  const chartData = [...alerts].reverse().map((alert) => ({
    name: alert.timestamp.split(' ')[1],
    packets: alert.count,
    severity: alert.severity
  }));

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#38bdf8', margin: '0' }}>🛡️ Network Intrusion Detection System (NIDS)</h1>
          <p style={{ color: '#94a3b8' }}>Real-time SOC anomaly monitoring dashboard</p>
        </div>

        {/* Executive KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '13px' }}>Total Captured Logs</p>
            <h2 style={{ margin: '0', color: '#f8fafc' }}>{alerts.length}</h2>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '13px' }}>Critical Threats</p>
            <h2 style={{ margin: '0', color: '#dc2626' }}>{criticalCount}</h2>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '13px' }}>High / Medium Surges</p>
            <h2 style={{ margin: '0', color: '#f97316' }}>{highCount + mediumCount}</h2>
          </div>
        </div>

        {/* Action Bar: Search, Pause Toggle, Export */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 Filter by Source IP or Severity..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#1e293b',
              color: '#fff',
              flex: '1',
              minWidth: '220px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setIsPaused(!isPaused)}
              style={{
                backgroundColor: isPaused ? '#16a34a' : '#ca8a04',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isPaused ? '▶ Resume Feed' : '⏸ Pause Feed'}
            </button>
            <button 
              onClick={exportLogs}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📥 Export Logs
            </button>
          </div>
        </div>

        {/* Live Traffic Volume Chart */}
        {chartData.length > 0 && (
          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8', fontSize: '16px' }}>📈 Live Traffic Volume Trend</h3>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Line type="monotone" dataKey="packets" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Live Security Alerts Section */}
        <h2>Live Security Alerts ({filteredAlerts.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredAlerts.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No alerts match your filter or network is secure.</p>
          ) : (
            filteredAlerts.map((alert, index) => {
              const severityColor = 
                alert.severity === 'CRITICAL' ? '#dc2626' : 
                alert.severity === 'HIGH' ? '#f97316' : '#eab308';

              return (
                <div key={index} style={{
                  backgroundColor: '#1e293b',
                  borderLeft: `5px solid ${severityColor}`,
                  padding: '15px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{alert.timestamp}</span>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 'bold', 
                      backgroundColor: severityColor, 
                      color: '#fff', 
                      padding: '2px 8px', 
                      borderRadius: '4px' 
                    }}>
                      {alert.severity || 'WARNING'}
                    </span>
                  </div>

                  <h3 style={{ margin: '8px 0 5px 0', color: severityColor }}>{alert.message}</h3>
                  <p style={{ margin: '4px 0' }}><strong>Source IP:</strong> {alert.source}</p>
                  <p style={{ margin: '4px 0' }}><strong>Destination IP:</strong> {alert.destination}</p>
                  <p style={{ margin: '4px 0' }}><strong>Packet Count:</strong> {alert.count}</p>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

export default App;