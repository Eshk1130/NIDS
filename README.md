#  Network Intrusion Detection System (NIDS)

A full-stack, real-time Network Intrusion Detection System built for summer training/academic projects. It captures live network packets, analyzes them for volumetric anomalies using threshold-based detection, serves alerts through a Flask REST API, and displays them on a live React (Vite) dashboard.

---

## Tech Stack

- **Backend:** Python 3.13, Scapy, Flask, Flask-CORS
- **Frontend:** React, Vite, CSS
- **Version Control:** Git & GitHub

---

## Project Structure

```text
NIDS/
│
├── backend/
│   ├── app.py          # Flask REST API & background Scapy packet sniffer thread
│   └── sniffer.py      # Core anomaly detection logic
│
├── frontend/
│   ├── src/            # React dashboard components & UI
│   ├── package.json    # Frontend dependencies
│   └── vite.config.js  # Vite configuration
│
└── README.md