import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/*
DEVICE TYPE
*/
export interface Device {
  id: string;
  name: string;
  type: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  airQuality?: number;
  motion?: string;
  battery?: number;
  signal?: number;
  txHash?: string;
}

/*
FETCH DEVICES FROM BACKEND
*/
export async function fetchDevices(): Promise<Device[]> {
  try {
    const res = await api.get("/api/devices");
    return res.data;
  } catch (err) {
    console.error("Device fetch failed:", err);
    return [];
  }
}

/*
BLOCKCHAIN TRANSACTIONS
*/
export async function fetchBlockchainTransactions() {

  const devices = await fetchDevices();

  return devices
    .filter((d) => d.txHash)
    .map((d, i) => ({
      hash: d.txHash!,
      blockNumber: 1000 + i,
      from: d.id,
      gasUsed: 21000,
      timestamp: new Date().toISOString(),
      verified: true,
    }));

}

/*
ANALYTICS SENSOR DATA
*/
export async function fetchSensorData() {

  const devices = await fetchDevices();

  return devices.map((d) => ({
    id: d.id,
    name: d.name,
    temperature: d.temperature ?? 0,
    humidity: d.humidity ?? 0,
  }));

}

/*
CHART DATA GENERATION
*/
export function generateChartData(points = 24) {

  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    temperature: +(20 + Math.random() * 10).toFixed(1),
    humidity: +(40 + Math.random() * 20).toFixed(1),
  }));

}

export default api;