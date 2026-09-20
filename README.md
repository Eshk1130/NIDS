# Network Intrusion Detection System (NIDS)

## Overview

The Network Intrusion Detection System (NIDS) is a full-stack security monitoring platform developed for real-time network traffic analysis, anomaly detection, and threat monitoring. The system employs deterministic rule-based detection techniques to identify suspicious network activity and classify potential threats based on observed traffic patterns. Emphasis is placed on transparent and explainable security analysis rather than machine learning-based approaches.

---

## System Architecture and Technology Stack

### Backend

* Python
* Flask
* Scapy
* Flask-CORS
* Threading

### Frontend

* React
* Vite
* Recharts
* CSS

### Version Control

* Git
* GitHub

---

## Core Features

### Real-Time Packet Capture and Inspection

The system captures live network packets directly from the host network interface using Scapy. Packet analysis includes inspection of network and transport layer information to identify communication patterns and protocol-specific activity.

### Protocol and Port-Based Signature Detection

Traffic is automatically categorized according to protocol type, including TCP, UDP, and ICMP. The detection engine identifies predefined behavioral signatures associated with common network reconnaissance and attack techniques.

| Signature                      | Detection Criteria                |
| ------------------------------ | --------------------------------- |
| SSH Brute-Force Activity       | Traffic involving Port 22         |
| Web Service Activity Spike     | Traffic involving Ports 80 or 443 |
| Ping Sweep or Network Scanning | ICMP Traffic                      |

### Severity Classification Framework

The system evaluates packet volume within a rolling five-second observation window and assigns severity levels according to predefined thresholds.

* Medium Severity
* High Severity
* Critical Severity

This approach enables rapid identification of abnormal traffic surges while maintaining low computational overhead.

### Security Operations Dashboard

A web-based dashboard provides real-time visualization of network activity and detected events. Key capabilities include:

* Live traffic monitoring
* Dynamic packet volume visualization
* Source IP-based filtering
* Event feed pause and resume functionality
* Security metric summaries

### Packet Forensics Interface

Individual alerts can be examined through a detailed analysis view containing:

* Protocol information
* Detection signatures
* Packet counts
* Timestamps
* Severity levels

### Security Log Export

Detected events can be exported as structured JSON files to support incident documentation, forensic analysis, and further security investigations.

---

## Evaluation and Threshold Framework

The anomaly detection mechanism is based on a threshold-driven evaluation model designed to balance detection sensitivity and false positive reduction.

| Parameter                   | Value                            | Description                                              |
| --------------------------- | -------------------------------- | -------------------------------------------------------- |
| Observation Window          | 5 Seconds                        | Rolling analysis period for traffic evaluation           |
| Medium Severity Threshold   | 30–45 Packets / 5 Seconds        | Moderate traffic increase                                |
| High Severity Threshold     | 46–70 Packets / 5 Seconds        | Significant traffic spike                                |
| Critical Severity Threshold | More than 70 Packets / 5 Seconds | Potential denial-of-service or volumetric attack pattern |

### Experimental Evaluation

Testing was conducted under normal local network conditions and simulated traffic bursts.

**Observed Results**

* False positive rate remained below 5% under standard network activity.
* End-to-end response latency remained below 1000 milliseconds from packet capture to dashboard visualization.
* Real-time alert generation was achieved without noticeable degradation in dashboard performance.

---

## Installation and Deployment

### Backend Setup

Navigate to the backend directory and install the required dependencies.

```powershell
cd backend
pip install flask flask-cors scapy
python app.py
```

The Flask server will initialize the packet capture engine and expose the API endpoints used by the frontend dashboard.

---

### Frontend Setup

Open a separate terminal window and execute the following commands.

```powershell
cd frontend
npm install
npm install recharts
npm run dev
```

After successful initialization, the dashboard can be accessed through:

```text
http://localhost:5173
```

---

## Project Structure

```text
NIDS/
│
├── backend/
│   ├── app.py
│   ├── packet_sniffer.py
│   ├── detection_engine.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── components/
│   └── package.json
│
└── README.md
```

---

## Design Objectives

The primary objectives of the project are:

1. Real-time network traffic monitoring.
2. Detection of suspicious traffic patterns using deterministic security rules.
3. Transparent and explainable threat classification.
4. Interactive visualization of security events.
5. Support for security analysis and incident investigation workflows.

---

## Future Work

Potential extensions of the system include:

* Historical event storage using database systems.
* User authentication and role-based access control.
* Customizable detection signatures.
* Threat intelligence feed integration.
* Advanced anomaly detection mechanisms.
* Automated alerting through email and webhook services.
* Distributed deployment across multiple monitored hosts.
