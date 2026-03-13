from web3 import Web3

ganache_url = "http://127.0.0.1:7545"

web3 = Web3(Web3.HTTPProvider(ganache_url))

def store_iot_data(device_id, sensor_type, value):

    try:

        if not web3.is_connected():
            print("Blockchain not connected")
            return "no-chain"

        account = web3.eth.accounts[0]

        tx = {
            "from": account,
            "to": account,
            "value": 0,
            "data": web3.to_hex(text=f"{device_id}-{sensor_type}-{value}")
        }

        tx_hash = web3.eth.send_transaction(tx)

        return web3.to_hex(tx_hash)

    except Exception as e:

        print("Blockchain error:", e)

        return "error"