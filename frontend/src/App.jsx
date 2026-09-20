import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <h1>🛡️ Network Intrusion Detection System (NIDS)</h1>
      <p style={{ color: '#94a3b8' }}>Real-time anomaly monitoring dashboard</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Live Security Alerts ({alerts.length})</h2>
        {loading ? (
          <p>Connecting to backend...</p>
        ) : alerts.length === 0 ? (
          <p style={{ color: '#34d399' }}>🟢 Network secure. No anomalies detected yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            {alerts.map((alert, index) => (
              <div key={index} style={{
                backgroundColor: '#1e293b',
                borderLeft: '5px solid #ef4444',
                padding: '15px',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{alert.timestamp}</span>
                <h3 style={{ margin: '5px 0', color: '#f87171' }}>{alert.message}</h3>
                <p style={{ margin: '5px 0' }}><strong>Source IP:</strong> {alert.source}</p>
                <p style={{ margin: '5px 0' }}><strong>Destination IP:</strong> {alert.destination}</p>
                <p style={{ margin: '5px 0' }}><strong>Packet Count:</strong> {alert.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;