import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const SEVERITY_COLORS = {
  CRITICAL: '#f0524f',
  HIGH: '#f59e42',
  MEDIUM: '#e6c34a',
};
const getSeverityColor = (severity) => SEVERITY_COLORS[severity] || SEVERITY_COLORS.MEDIUM;

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const ShieldIcon = ({ size = 22 }) => (
  <svg {...iconProps} width={size} height={size}>
    <path d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);
const PauseIcon = () => (
  <svg {...iconProps}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const PlayIcon = () => (
  <svg {...iconProps}>
    <path d="M7 5l12 7-12 7V5z" />
  </svg>
);
const DownloadIcon = () => (
  <svg {...iconProps}>
    <path d="M12 4v11" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

const SeverityBadge = ({ severity }) => (
  <span className="nids-badge" style={{ '--sev': getSeverityColor(severity) }}>
    {severity}
  </span>
);

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

body { margin: 0; background: #0d1320; }

.nids {
  --bg: #0d1320;
  --surface: #141b2b;
  --surface-2: #1a2336;
  --surface-3: #222d45;
  --border: #263149;
  --border-strong: #33415f;
  --text: #e7ecf6;
  --text-muted: #97a3bb;
  --accent: #5aa2f0;
  --crit: ${SEVERITY_COLORS.CRITICAL};
  --high: ${SEVERITY_COLORS.HIGH};

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}
.nids *, .nids *::before, .nids *::after { box-sizing: border-box; }
.nids h1, .nids h2, .nids h3, .nids p, .nids dl, .nids dd { margin: 0; }

.nids-shell { max-width: 1240px; margin: 0 auto; padding: 24px 24px 48px; }

/* Header */
.nids-header {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px;
  padding-bottom: 20px; margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.nids-brand { display: flex; align-items: center; gap: 14px; }
.nids-brand-icon {
  width: 42px; height: 42px; border-radius: 8px;
  display: grid; place-items: center;
  background: var(--surface-2); border: 1px solid var(--border-strong);
  color: var(--accent);
}
.nids-title { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.25; }
.nids-subtitle { margin-top: 2px; color: var(--text-muted); font-size: 13px; }
.nids-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* Buttons */
.nids-btn {
  display: inline-flex; align-items: center; gap: 8px;
  height: 36px; padding: 0 14px;
  border-radius: 6px; border: 1px solid var(--border-strong);
  background: var(--surface-2); color: var(--text);
  font: inherit; font-weight: 500; cursor: pointer;
  transition: background-color .15s, border-color .15s, color .15s;
}
.nids-btn:hover { background: var(--surface-3); }
.nids-btn--primary { background: var(--accent); border-color: var(--accent); color: #08111f; }
.nids-btn--primary:hover { background: #78b4f5; border-color: #78b4f5; }
.nids-btn--paused { border-color: var(--high); color: var(--high); }
.nids-btn:focus-visible,
.nids-search input:focus-visible,
.nids-row:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* KPI strip */
.nids-kpis {
  display: grid; grid-template-columns: repeat(3, 1fr);
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; margin-bottom: 16px; overflow: hidden;
}
.nids-kpi { padding: 16px 20px; border-left: 1px solid var(--border); }
.nids-kpi:first-child { border-left: 0; }
.nids-kpi-label { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 13px; }
.nids-kpi-dot { width: 8px; height: 8px; border-radius: 2px; background: var(--kpi); }
.nids-kpi-value {
  margin-top: 6px; font-size: 30px; font-weight: 600; line-height: 1.1;
  font-variant-numeric: tabular-nums; color: var(--kpi-value, var(--text));
}

/* Panels */
.nids-panel {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; margin-bottom: 16px; overflow: hidden;
}
.nids-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px;
  padding: 14px 16px; border-bottom: 1px solid var(--border);
}
.nids-panel-title { font-size: 15px; font-weight: 600; }
.nids-count { margin-left: 6px; color: var(--text-muted); font-weight: 400; font-variant-numeric: tabular-nums; }
.nids-chart { width: 100%; height: 220px; padding: 16px 16px 8px 4px; }

/* Search */
.nids-search { position: relative; flex: 1 1 280px; max-width: 400px; color: var(--text-muted); }
.nids-search svg { position: absolute; left: 11px; top: 10px; pointer-events: none; }
.nids-search input {
  width: 100%; height: 36px; padding: 0 12px 0 34px;
  background: var(--bg); border: 1px solid var(--border-strong); border-radius: 6px;
  color: var(--text); font: inherit;
}
.nids-search input::placeholder { color: var(--text-muted); }
.nids-search input:focus { border-color: var(--accent); }

/* Table */
.nids-table-wrap { overflow: auto; max-height: 640px; }
.nids-table { width: 100%; min-width: 880px; border-collapse: collapse; }
.nids-table th {
  position: sticky; top: 0; z-index: 1;
  padding: 10px 16px; text-align: left; white-space: nowrap;
  background: var(--surface-2); border-bottom: 1px solid var(--border);
  color: var(--text-muted); font-size: 12px; font-weight: 600;
}
.nids-table td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.nids-table tbody tr:last-child td { border-bottom: 0; }
.nids-table .nids-num { text-align: right; }
.nids-row { cursor: pointer; transition: background-color .12s; }
.nids-row:hover { background: var(--surface-2); }
.nids-row:focus-visible { outline-offset: -2px; }
.nids-row td:first-child { box-shadow: inset 3px 0 0 var(--sev); }
.nids-message { font-weight: 500; }
.nids-mono {
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px; font-variant-numeric: tabular-nums;
}
.nids-muted { color: var(--text-muted); }
.nids-empty { padding: 44px 16px; text-align: center; color: var(--text-muted); }

/* Badges */
.nids-badge {
  display: inline-flex; align-items: center; gap: 6px;
  height: 22px; padding: 0 8px; border-radius: 4px;
  font-size: 12px; font-weight: 600; white-space: nowrap;
  color: var(--sev);
  background: color-mix(in srgb, var(--sev) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--sev) 40%, transparent);
}
.nids-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.nids-proto {
  display: inline-block; padding: 1px 8px; border-radius: 4px;
  border: 1px solid var(--border-strong); color: var(--text-muted);
  font-family: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 12px;
}

/* Modal */
.nids-overlay {
  position: fixed; inset: 0; z-index: 1000; padding: 16px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(5, 8, 15, 0.72);
  animation: nids-fade .15s ease-out;
}
.nids-dialog {
  width: min(560px, 100%); max-height: 90vh; overflow: auto;
  background: var(--surface); border: 1px solid var(--border-strong); border-radius: 10px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
  animation: nids-pop .15s ease-out;
}
.nids-dialog-head { padding: 18px 20px; border-bottom: 1px solid var(--border); }
.nids-dialog-title { font-size: 16px; font-weight: 600; }
.nids-dialog-body { padding: 4px 20px; }
.nids-field {
  display: grid; grid-template-columns: 150px 1fr; gap: 12px; align-items: center;
  padding: 11px 0; border-bottom: 1px solid var(--border);
}
.nids-field:last-child { border-bottom: 0; }
.nids-field dt { color: var(--text-muted); font-size: 13px; }
.nids-field dd { min-width: 0; overflow-wrap: anywhere; }
.nids-dialog-foot {
  display: flex; justify-content: flex-end;
  padding: 14px 20px; border-top: 1px solid var(--border);
}

@keyframes nids-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes nids-pop { from { opacity: 0; transform: translateY(6px) scale(.985); } to { opacity: 1; transform: none; } }

/* Responsive */
@media (max-width: 720px) {
  .nids-shell { padding: 16px 12px 32px; }
  .nids-kpis { grid-template-columns: 1fr; }
  .nids-kpi { border-left: 0; border-top: 1px solid var(--border); }
  .nids-kpi:first-child { border-top: 0; }
  .nids-actions { width: 100%; }
  .nids-actions .nids-btn { flex: 1; justify-content: center; }
  .nids-search { max-width: none; }
  .nids-field { grid-template-columns: 110px 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .nids *, .nids *::before, .nids *::after { animation: none !important; transition: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

function App() {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

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

  // Filter alerts based on search term (Source IP, Threat Type, or Severity)
  const filteredAlerts = alerts.filter(alert =>
    alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.threatType.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openAlert = (alert) => setSelectedAlert(alert);

  return (
    <div className="nids">
      <style>{styles}</style>

      <div className="nids-shell">

        {/* Header */}
        <header className="nids-header">
          <div className="nids-brand">
            <div className="nids-brand-icon"><ShieldIcon /></div>
            <div>
              <h1 className="nids-title">Network Intrusion Detection System (NIDS)</h1>
              <p className="nids-subtitle">Real-time SOC anomaly monitoring dashboard</p>
            </div>
          </div>

          <div className="nids-actions">
            <button
              type="button"
              className={`nids-btn${isPaused ? ' nids-btn--paused' : ''}`}
              onClick={() => setIsPaused(!isPaused)}
              aria-pressed={isPaused}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
              {isPaused ? 'Resume feed' : 'Pause feed'}
            </button>
            <button type="button" className="nids-btn nids-btn--primary" onClick={exportLogs}>
              <DownloadIcon />
              Export logs
            </button>
          </div>
        </header>

        {/* Executive KPI Summary */}
        <section className="nids-kpis" aria-label="Summary metrics">
          <div className="nids-kpi" style={{ '--kpi': '#5aa2f0' }}>
            <div className="nids-kpi-label"><span className="nids-kpi-dot" />Total captured logs</div>
            <div className="nids-kpi-value">{alerts.length}</div>
          </div>
          <div className="nids-kpi" style={{ '--kpi': SEVERITY_COLORS.CRITICAL, '--kpi-value': SEVERITY_COLORS.CRITICAL }}>
            <div className="nids-kpi-label"><span className="nids-kpi-dot" />Critical threats</div>
            <div className="nids-kpi-value">{criticalCount}</div>
          </div>
          <div className="nids-kpi" style={{ '--kpi': SEVERITY_COLORS.HIGH, '--kpi-value': SEVERITY_COLORS.HIGH }}>
            <div className="nids-kpi-label"><span className="nids-kpi-dot" />High / medium surges</div>
            <div className="nids-kpi-value">{highCount + mediumCount}</div>
          </div>
        </section>

        {/* Live Traffic Volume Chart */}
        {chartData.length > 0 && (
          <section className="nids-panel">
            <div className="nids-panel-head">
              <h2 className="nids-panel-title">Live traffic volume trend</h2>
            </div>
            <div className="nids-chart">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="#263149" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#33415f"
                    tick={{ fill: '#97a3bb', fontSize: 11 }}
                    tickLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    stroke="#33415f"
                    tick={{ fill: '#97a3bb', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={44}
                  />
                  <Tooltip
                    cursor={{ stroke: '#33415f' }}
                    contentStyle={{
                      backgroundColor: '#0d1320',
                      border: '1px solid #33415f',
                      borderRadius: 6,
                      color: '#e7ecf6',
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#97a3bb' }}
                    itemStyle={{ color: '#e7ecf6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="packets"
                    name="Packets"
                    stroke="#5aa2f0"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#5aa2f0', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#5aa2f0', stroke: '#0d1320', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Live Security Alerts */}
        <section className="nids-panel">
          <div className="nids-panel-head">
            <h2 className="nids-panel-title">
              Live security alerts
              <span className="nids-count">({filteredAlerts.length})</span>
            </h2>
            <div className="nids-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Filter by source IP, threat type, or severity"
                aria-label="Filter alerts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <p className="nids-empty">No alerts match your filter, or the network is secure.</p>
          ) : (
            <div className="nids-table-wrap">
              <table className="nids-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Severity</th>
                    <th>Protocol</th>
                    <th>Alert</th>
                    <th>Source IP</th>
                    <th>Destination IP</th>
                    <th className="nids-num">Packets</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert, index) => (
                    <tr
                      key={index}
                      className="nids-row"
                      style={{ '--sev': getSeverityColor(alert.severity) }}
                      tabIndex={0}
                      onClick={() => openAlert(alert)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openAlert(alert);
                        }
                      }}
                    >
                      <td className="nids-mono nids-muted" style={{ whiteSpace: 'nowrap' }}>{alert.timestamp}</td>
                      <td><SeverityBadge severity={alert.severity} /></td>
                      <td><span className="nids-proto">{alert.protocol || 'IP'}</span></td>
                      <td className="nids-message">{alert.message}</td>
                      <td className="nids-mono">{alert.source}</td>
                      <td className="nids-mono">{alert.destination}</td>
                      <td className="nids-mono nids-num">{alert.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Packet Forensics Modal */}
        {selectedAlert && (
          <div className="nids-overlay">
            <div className="nids-dialog" role="dialog" aria-modal="true" aria-labelledby="nids-dialog-title">
              <div className="nids-dialog-head">
                <h2 className="nids-dialog-title" id="nids-dialog-title">Packet forensics details</h2>
              </div>

              <dl className="nids-dialog-body">
                <div className="nids-field">
                  <dt>Timestamp</dt>
                  <dd className="nids-mono">{selectedAlert.timestamp}</dd>
                </div>
                <div className="nids-field">
                  <dt>Source IP</dt>
                  <dd className="nids-mono">{selectedAlert.source}</dd>
                </div>
                <div className="nids-field">
                  <dt>Destination IP</dt>
                  <dd className="nids-mono">{selectedAlert.destination}</dd>
                </div>
                <div className="nids-field">
                  <dt>Protocol layer</dt>
                  <dd><span className="nids-proto">{selectedAlert.protocol || 'IP'}</span></dd>
                </div>
                <div className="nids-field">
                  <dt>Threat signature</dt>
                  <dd>{selectedAlert.threatType}</dd>
                </div>
                <div className="nids-field">
                  <dt>Severity vector</dt>
                  <dd><SeverityBadge severity={selectedAlert.severity} /></dd>
                </div>
                <div className="nids-field">
                  <dt>Packet volume</dt>
                  <dd className="nids-mono">{selectedAlert.count} packets / 5s window</dd>
                </div>
              </dl>

              <div className="nids-dialog-foot">
                <button type="button" className="nids-btn" onClick={() => setSelectedAlert(null)}>
                  Close forensics panel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;