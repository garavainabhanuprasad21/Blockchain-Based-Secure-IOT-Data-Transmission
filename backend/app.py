from flask import Flask, jsonify
from flask_cors import CORS
from blockchain import store_iot_data
from simulator import generate_devices

app = Flask(__name__)
CORS(app)


@app.route("/api/devices")
def get_devices():

    devices = generate_devices()

    for device in devices:

        value = "0"

        if device.get("temperature") is not None:
            value = device["temperature"]

        elif device.get("humidity") is not None:
            value = device["humidity"]

        elif device.get("pressure") is not None:
            value = device["pressure"]

        elif device.get("airQuality") is not None:
            value = device["airQuality"]

        elif device.get("motion") is not None:
            value = device["motion"]

        tx_hash = store_iot_data(device["id"], device["type"], str(value))

        device["txHash"] = tx_hash

    return jsonify(devices)


if __name__ == "__main__":
    app.run(debug=True, port=5000)