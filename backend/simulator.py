import random
from datetime import datetime

def generate_devices():

    devices = [

        {
            "id": "IoT-001",
            "name": "Temp Sensor Alpha",
            "type": "Temperature",
            "location": "Building A - Floor 3",
            "firmware": "v2.4.1",
            "temperature": round(20 + random.random() * 10, 1),
        },

        {
            "id": "IoT-002",
            "name": "Humidity Node Beta",
            "type": "Humidity",
            "location": "Building B - Roof",
            "firmware": "v2.3.8",
            "humidity": round(40 + random.random() * 40, 1),
        },

        {
            "id": "IoT-003",
            "name": "Gateway Gamma",
            "type": "Multi-Sensor",
            "location": "Building A - Lobby",
            "firmware": "v3.1.0",
            "airQuality": random.randint(50, 100),
        },

        {
            "id": "IoT-004",
            "name": "Edge Device Delta",
            "type": "Pressure",
            "location": "Building C - Basement",
            "firmware": "v2.2.5",
            "pressure": random.randint(990, 1030),
        },

        {
            "id": "IoT-005",
            "name": "Sensor Epsilon",
            "type": "Motion",
            "location": "Building A - Parking",
            "firmware": "v1.9.2",
            "motion": random.choice(["Detected", "Not Detected"]),
        },

        # NEW DEVICE 1
        {
            "id": "IoT-006",
            "name": "Temp Sensor Beta",
            "type": "Temperature",
            "location": "Building B - Floor 2",
            "firmware": "v2.4.1",
            "temperature": round(20 + random.random() * 10, 1),
        },

        # NEW DEVICE 2
        {
            "id": "IoT-007",
            "name": "Humidity Node Alpha",
            "type": "Humidity",
            "location": "Building A - Floor 1",
            "firmware": "v2.3.8",
            "humidity": round(40 + random.random() * 40, 1),
        },

        # NEW DEVICE 3
        {
            "id": "IoT-008",
            "name": "Temp Sensor Gamma",
            "type": "Temperature",
            "location": "Building C - Floor 4",
            "firmware": "v2.4.1",
            "temperature": round(20 + random.random() * 10, 1),
        }

    ]

    for d in devices:
        d["status"] = "active"
        d["battery"] = random.randint(50, 100)
        d["signal"] = random.randint(60, 100)
        d["lastUpdate"] = datetime.now().isoformat()

    return devices