import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nids_security_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Function to fetch alerts from the Flask backend
  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alerts');
      const data = await response.json();
      setAlerts(data.reverse()); // Show newest alerts first
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Poll backend every 3 seconds for real-time updates
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <h1>🛡️ Network Intrusion Detection System (NIDS)</h1>
      <p style={{ color: '#94a3b8' }}>Real-time anomaly monitoring dashboard</p>

      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Live Security Alerts ({alerts.length})</h2>
          <button 
            onClick={exportLogs}
            style={{
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📥 Export Logs
          </button>
        </div>
        {loading ? (
          <p>Connecting to backend...</p>
        ) : alerts.length === 0 ? (
          <p style={{ color: '#34d399' }}>🟢 Network secure. No anomalies detected yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {alerts.map((alert, index) => {
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;