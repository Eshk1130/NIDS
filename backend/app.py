from collections import defaultdict
import threading
import time
from flask import Flask, jsonify
from flask_cors import CORS
from scapy.all import IP, sniff

app = Flask(__name__)
CORS(app)  # Enables React to communicate with this backend

# In-memory storage for alerts and traffic stats
alerts_log = []
traffic_log = defaultdict(lambda: [0, time.time()])

# Threshold settings
PACKET_LIMIT = 30
TIME_WINDOW = 5


def packet_callback(packet):
  if packet.haslayer(IP):
    ip_layer = packet.getlayer(IP)
    src_ip = ip_layer.src
    dst_ip = ip_layer.dst

    current_time = time.time()
    count, start_time = traffic_log[src_ip]

    if current_time - start_time > TIME_WINDOW:
      traffic_log[src_ip] = [1, current_time]
    else:
      traffic_log[src_ip][0] += 1
      if traffic_log[src_ip][0] > PACKET_LIMIT:
        packet_count = traffic_log[src_ip][0]

        if packet_count > 70:
          severity = "CRITICAL"
          message = f"Critical traffic spike detected ({packet_count} packets in {TIME_WINDOW}s)"
        elif packet_count > 45:
          severity = "HIGH"
          message = f"High traffic volume detected ({packet_count} packets in {TIME_WINDOW}s)"
        else:
          severity = "MEDIUM"
          message = f"Moderate traffic surge detected ({packet_count} packets in {TIME_WINDOW}s)"

        alert_msg = {
            "source": src_ip,
            "destination": dst_ip,
            "count": packet_count,
            "message": message,
            "severity": severity,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        # Avoid duplicating identical rapid alerts
        if not alerts_log or alerts_log[-1]["source"] != src_ip:
          alerts_log.append(alert_msg)
          print(f"[!] ALERT LOGGED: {src_ip} ({severity})")


def start_sniffer():
  print("Starting background packet capture & anomaly detection...")
  sniff(prn=packet_callback, store=False)


# API Endpoint to fetch alerts for the React frontend
@app.route("/api/alerts", methods=["GET"])
def get_alerts():
  return jsonify(alerts_log)


if __name__ == "__main__":
  # Run the packet sniffer in a separate background thread so it doesn't block Flask
  sniffer_thread = threading.Thread(target=start_sniffer, daemon=True)
  sniffer_thread.start()

  # Start the Flask web server
  app.run(debug=True, port=5000, use_reloader=False)