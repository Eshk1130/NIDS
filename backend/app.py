from flask import Flask, jsonify
from flask_cors import CORS
from scapy.all import sniff, IP, TCP, UDP, ICMP
from datetime import datetime
import threading
import time

app = Flask(__name__)
CORS(app)

# In-memory store for recent alerts
alerts_log = []
packet_counts = {}

def analyze_packet(packet):
    if packet.haslayer(IP):
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        current_time = time.time()
        
        # Track packet count per source IP in a 5-second window
        key = src_ip
        if key not in packet_counts:
            packet_counts[key] = {'count': 0, 'start_time': current_time}
        
        # Reset window every 5 seconds
        if current_time - packet_counts[key]['start_time'] > 5:
            packet_counts[key] = {'count': 1, 'start_time': current_time}
        else:
            packet_counts[key]['count'] += 1
            
        packet_count = packet_counts[key]['count']
        
        # Protocol & Port Signature Analysis
        proto_name = "OTHER"
        threat_type = "Traffic Surge"
        
        if packet.haslayer(TCP):
            proto_name = "TCP"
            sport = packet[TCP].sport
            dport = packet[TCP].dport
            if dport == 22 or sport == 22:
                threat_type = "SSH Brute-Force Signature"
            elif dport == 80 or dport == 443:
                threat_type = "Web Service Spike"
            else:
                threat_type = "TCP Flood / Connection Surge"
        elif packet.haslayer(UDP):
            proto_name = "UDP"
            threat_type = "UDP Volumetric Activity"
        elif packet.haslayer(ICMP):
            proto_name = "ICMP"
            threat_type = "Ping Sweep / Network Scan"

        # Tiered Severity Logic based on packet volume
        if packet_count > 70:
            severity = "CRITICAL"
        elif packet_count > 45:
            severity = "HIGH"
        elif packet_count > 30:
            severity = "MEDIUM"
        else:
            return # Ignore minor background traffic below threshold

        # Build alert object
        alert = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "source": src_ip,
            "destination": dst_ip,
            "count": packet_count,
            "protocol": proto_name,
            "threatType": threat_type,
            "message": f"{threat_type} detected ({packet_count} pkts)",
            "severity": severity
        }
        
        # Avoid duplicate spam within the same window
        if not any(a['source'] == src_ip and a['severity'] == severity and abs(time.time() - datetime.strptime(a['timestamp'], "%Y-%m-%d %H:%M:%S").timestamp()) < 5 for a in alerts_log):
            alerts_log.insert(0, alert)
            # Keep only the last 100 alerts
            if len(alerts_log) > 100:
                alerts_log.pop()

def background_sniffer():
    # Sniff network packets (store=False to save memory)
    sniff(prn=analyze_packet, store=False)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts_log)

if __name__ == '__main__':
    # Start packet sniffer in a background thread
    t = threading.Thread(target=background_sniffer, daemon=True)
    t.start()
    app.run(host='0.0.0.0', port=5000, debug=False)