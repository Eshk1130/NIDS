from collections import defaultdict
import time

from scapy.all import IP, sniff

# Dictionary to track packet counts per IP: {ip_address: [packet_count, start_time]}
traffic_log = defaultdict(lambda: [0, time.time()])

# Threshold settings
PACKET_LIMIT = 30  # Max packets allowed in the time window
TIME_WINDOW = 5  # Time window in seconds


def packet_callback(packet):
    if packet.haslayer(IP):
        ip_layer = packet.getlayer(IP)
        src_ip = ip_layer.src
        dst_ip = ip_layer.dst

        current_time = time.time()
        count, start_time = traffic_log[src_ip]

        # Reset the window if the time elapsed exceeds the configured threshold.
        if current_time - start_time > TIME_WINDOW:
            traffic_log[src_ip] = [1, current_time]
        else:
            traffic_log[src_ip][0] += 1

            # Check if the threshold is breached.
            if traffic_log[src_ip][0] > PACKET_LIMIT:
                print(
                    f"[!] ALERT: High traffic volume detected from {src_ip}!"
                    f" ({traffic_log[src_ip][0]} packets in {TIME_WINDOW}s)"
                )
            else:
                print(f"[+] Normal Packet: {src_ip} ---> {dst_ip}")


if __name__ == "__main__":
    print(
        "Starting intelligent packet capture & anomaly detection... Press "
        "Ctrl+C to stop."
    )
    sniff(prn=packet_callback, store=False)
