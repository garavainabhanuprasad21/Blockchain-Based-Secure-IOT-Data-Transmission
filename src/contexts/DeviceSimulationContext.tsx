/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

export interface SimulatedDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  firmware: string;

  temperature?: number;
  humidity?: number;
  pressure?: number;
  airQuality?: number;
  motion?: string;

  status: "active" | "offline" | "charging";
  battery: number;
  signal: number;
  lastUpdate: string;

  rechargeTarget?: number;
}

interface BackendDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  firmware: string;

  temperature?: number;
  humidity?: number;
  pressure?: number;
  airQuality?: number;
  motion?: string;
}

interface DeviceSimulationContextType {
  devices: SimulatedDevice[];
}

const DeviceSimulationContext =
  createContext<DeviceSimulationContextType | null>(null);

export function DeviceSimulationProvider({
  children
}: {
  children: ReactNode;
}) {

  const [devices, setDevices] = useState<SimulatedDevice[]>([]);

  const getDrainRate = (type: string) => {
    switch (type) {
      case "Temperature":
      case "Humidity":
      case "Pressure":
      case "Multi-Sensor":
      case "Motion":
        return 1;
      default:
        return 1;
    }
  };

  const updateLifecycle = (deviceList: SimulatedDevice[]) => {

    return deviceList.map((device) => {

      if (device.status === "active") {

        const newBattery = Math.max(
          0,
          device.battery - getDrainRate(device.type)
        );

        if (newBattery <= 0) {
          return {
            ...device,
            battery: 0,
            signal: 0,
            status: "offline" as const,
            rechargeTarget: 30 + Math.floor(Math.random() * 50)
          };
        }

        return { ...device, battery: newBattery };
      }

      if (device.status === "offline") {

        if (Math.random() < 0.3) {
          return {
            ...device,
            status: "charging" as const,
            battery: 1
          };
        }

        return device;
      }

      if (device.status === "charging") {

        const newBattery = Math.min(100, device.battery + 5);

        if (device.rechargeTarget && newBattery >= device.rechargeTarget) {
          return {
            ...device,
            battery: newBattery,
            status: "active" as const,
            signal: 70 + Math.floor(Math.random() * 30),
            rechargeTarget: undefined
          };
        }

        return { ...device, battery: newBattery };
      }

      return device;
    });

  };

  useEffect(() => {

    const fetchDevices = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/devices");
        const backendDevices: BackendDevice[] = await res.json();

        setDevices((prevDevices) => {

          const lifecycleDevices = updateLifecycle(prevDevices);

          const updatedDevices: SimulatedDevice[] = backendDevices.map((backend) => {

            const existing = lifecycleDevices.find(
              (d) => d.id === backend.id
            );

            if (existing) {
              return {
                ...existing,
                temperature: backend.temperature,
                humidity: backend.humidity,
                pressure: backend.pressure,
                airQuality: backend.airQuality,
                motion: backend.motion,
                lastUpdate: new Date().toISOString()
              };
            }

            return {
              id: backend.id,
              name: backend.name,
              type: backend.type,
              location: backend.location,
              firmware: backend.firmware,

              temperature: backend.temperature,
              humidity: backend.humidity,
              pressure: backend.pressure,
              airQuality: backend.airQuality,
              motion: backend.motion,

              status: "active" as const,
              battery: 20 + Math.floor(Math.random() * 80),
              signal: 70 + Math.floor(Math.random() * 30),
              lastUpdate: new Date().toISOString()
            };

          });

          return updatedDevices;

        });

      } catch (error) {

        console.error("Backend connection failed:", error);

      }

    };

    fetchDevices();

    const interval = setInterval(fetchDevices, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <DeviceSimulationContext.Provider value={{ devices }}>
      {children}
    </DeviceSimulationContext.Provider>
  );
}

export function useDeviceSimulation() {

  const context = useContext(DeviceSimulationContext);

  if (!context) {
    throw new Error(
      "useDeviceSimulation must be used within DeviceSimulationProvider"
    );
  }

  return context;
}