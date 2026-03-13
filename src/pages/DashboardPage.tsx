/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback, useRef } from "react";
import SensorCard from "@/components/dashboard/SensorCard";
import SensorChart from "@/components/dashboard/SensorChart";
import BlockchainTable from "@/components/dashboard/BlockchainTable";
import DeviceStatusPanel from "@/components/dashboard/DeviceStatusPanel";
import { fetchBlockchainTransactions } from "@/services/api";
import { useDeviceSimulation, type SimulatedDevice } from "@/contexts/DeviceSimulationContext";

const MAX_CHART_POINTS = 30;

interface BlockchainTx {
  hash: string;
  blockNumber: number;
  from: string;
  gasUsed: number;
  timestamp: string;
  verified: boolean;
}

export default function DashboardPage() {

  const { devices } = useDeviceSimulation();

  const [blockchain, setBlockchain] = useState<BlockchainTx[]>([]);

  const [chartData, setChartData] = useState<
    Array<{ time: string; temperature: number; humidity: number }>
  >([]);

  const devicesRef = useRef<SimulatedDevice[]>(devices);

  /* KEEP DEVICES UPDATED */

  useEffect(() => {
    devicesRef.current = devices;
  }, [devices]);

  /* FETCH BLOCKCHAIN TRANSACTIONS */

  useEffect(() => {

    async function loadBlockchain() {

      try {

        const data = await fetchBlockchainTransactions();

        setBlockchain(data || []);

      } catch (err) {

        console.error("Blockchain load error:", err);

      }

    }

    loadBlockchain();

    const interval = setInterval(loadBlockchain, 5000);

    return () => clearInterval(interval);

  }, []);

  /* ADD NEW CHART POINT */

  const addChartPoint = useCallback(() => {

    const sourceDevices = devicesRef.current;

    const now = new Date();

    const time =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}:` +
      `${String(now.getSeconds()).padStart(2, "0")}`;

    const active = sourceDevices.filter((d) => d.status === "active");

    const tempDevices = active.filter((d) => d.temperature !== undefined);
    const humidityDevices = active.filter((d) => d.humidity !== undefined);

    const temperature =
      tempDevices.length > 0
        ? +(tempDevices.reduce((a, d) => a + (d.temperature ?? 0), 0) / tempDevices.length).toFixed(1)
        : 0;

    const humidity =
      humidityDevices.length > 0
        ? +(humidityDevices.reduce((a, d) => a + (d.humidity ?? 0), 0) / humidityDevices.length).toFixed(1)
        : 0;

    setChartData((prev) =>
      [...prev, { time, temperature, humidity }].slice(-MAX_CHART_POINTS)
    );

  }, []);

  /* INITIALIZE CHART */

  useEffect(() => {

    if (!devices.length) return;

    const active = devices.filter((d) => d.status === "active");

    const tempDevices = active.filter((d) => d.temperature !== undefined);
    const humidityDevices = active.filter((d) => d.humidity !== undefined);

    const baseTemp =
      tempDevices.length > 0
        ? tempDevices.reduce((a, d) => a + (d.temperature ?? 0), 0) / tempDevices.length
        : 0;

    const baseHumidity =
      humidityDevices.length > 0
        ? humidityDevices.reduce((a, d) => a + (d.humidity ?? 0), 0) / humidityDevices.length
        : 0;

    const initial = Array.from({ length: 10 }, (_, i) => {

      const d = new Date(Date.now() - (10 - i) * 5000);

      const tempJitter = (Math.random() - 0.5) * 2;
      const humidityJitter = (Math.random() - 0.5) * 3;

      return {
        time:
          `${String(d.getHours()).padStart(2, "0")}:` +
          `${String(d.getMinutes()).padStart(2, "0")}:` +
          `${String(d.getSeconds()).padStart(2, "0")}`,
        temperature: +(baseTemp + tempJitter).toFixed(1),
        humidity: +(baseHumidity + humidityJitter).toFixed(1),
      };

    });

    setChartData(initial);

  }, [devices]);

  /* UPDATE CHART EVERY 5s */

  useEffect(() => {

    const interval = setInterval(() => {
      addChartPoint();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /* SENSOR STATS */

  const activeSensors = devices.filter((s) => s.status === "active");

  const tempDevices = activeSensors.filter((s) => s.temperature !== undefined);
  const humidityDevices = activeSensors.filter((s) => s.humidity !== undefined);

  const avgTemp =
    tempDevices.length > 0
      ? (
          tempDevices.reduce((a, s) => a + (s.temperature ?? 0), 0) /
          tempDevices.length
        ).toFixed(1)
      : "0";

  const avgHumidity =
    humidityDevices.length > 0
      ? (
          humidityDevices.reduce((a, s) => a + (s.humidity ?? 0), 0) /
          humidityDevices.length
        ).toFixed(1)
      : "0";

  /* TOP 5 DEVICES BY BATTERY */

  const topDevices = [...devices]
    .sort((a, b) => b.battery - a.battery)
    .slice(0, 5);

  return (

    <div className="space-y-6 animate-slide-in">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <SensorCard
          title="Avg. Temperature"
          value={avgTemp}
          unit="°C"
          type="temperature"
          index={0}
        />

        <SensorCard
          title="Avg. Humidity"
          value={avgHumidity}
          unit="%"
          type="humidity"
          index={1}
        />

        <SensorCard
          title="Active Devices"
          value={activeSensors.length}
          unit={`/ ${devices.length}`}
          type="status"
          index={2}
        />

        <SensorCard
          title="Transactions"
          value={blockchain.length}
          unit="blocks"
          type="activity"
          index={3}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <SensorChart
          title="Temperature (Live)"
          data={chartData}
          dataKey="temperature"
        />

        <SensorChart
          title="Humidity (Live)"
          data={chartData}
          dataKey="humidity"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        <div className="lg:col-span-3">
          <BlockchainTable data={blockchain} />
        </div>

        <div className="lg:col-span-2">
          <DeviceStatusPanel devices={topDevices} />
        </div>

      </div>

    </div>

  );
}