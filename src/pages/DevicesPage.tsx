import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  Search,
  MapPin,
  Cpu,
  HardDrive,
  Battery,
  BatteryLow,
  BatteryCharging,
  Signal,
  SignalLow,
  SignalZero
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useDeviceSimulation } from "@/contexts/DeviceSimulationContext";

function getBatteryIcon(battery: number, status: string) {
  if (status === "charging") return <BatteryCharging className="w-3.5 h-3.5 text-success" />;
  if (battery <= 15) return <BatteryLow className="w-3.5 h-3.5 text-destructive" />;
  return <Battery className="w-3.5 h-3.5 text-muted-foreground" />;
}

function getSignalIcon(signal: number) {
  if (signal <= 20) return <SignalZero className="w-3.5 h-3.5 text-destructive" />;
  if (signal <= 50) return <SignalLow className="w-3.5 h-3.5 text-warning" />;
  return <Signal className="w-3.5 h-3.5 text-success" />;
}

function getBatteryColor(battery: number) {
  if (battery <= 15) return "text-destructive";
  if (battery <= 40) return "text-warning";
  return "text-success";
}

export default function DevicesPage() {

  const { devices } = useDeviceSimulation();
  const [search, setSearch] = useState("");

  const filtered = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            IoT Devices
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor connected devices
          </p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {filtered.map((device, i) => (

          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover p-5"
          >

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center gap-3">

                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    device.status === "active"
                      ? "bg-success/10"
                      : device.status === "charging"
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                  )}
                >

                  {device.status === "active" ? (
                    <Wifi className="w-5 h-5 text-success" />
                  ) : device.status === "charging" ? (
                    <BatteryCharging className="w-5 h-5 text-warning" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-destructive" />
                  )}

                </div>

                <div>
                  <p className="font-display font-semibold text-foreground text-sm">
                    {device.name}
                  </p>

                  <p className="text-[10px] font-display text-muted-foreground">
                    {device.id}
                  </p>
                </div>

              </div>

              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  device.status === "active"
                    ? "bg-success/10 text-success"
                    : device.status === "charging"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {device.status === "active"
                  ? "Active"
                  : device.status === "charging"
                  ? "Charging"
                  : "Offline"}
              </span>

            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">

                <div className="flex items-center gap-1.5">
                  {getBatteryIcon(device.battery, device.status)}
                  <span className="text-xs text-muted-foreground">Battery</span>
                </div>

                <span className={cn("text-xs font-semibold", getBatteryColor(device.battery))}>
                  {device.battery}%
                </span>

              </div>

              <Progress value={device.battery} className="h-1.5" />
            </div>

            <div className="mb-3">

              <div className="flex items-center justify-between mb-1">

                <div className="flex items-center gap-1.5">
                  {getSignalIcon(device.signal)}
                  <span className="text-xs text-muted-foreground">Signal</span>
                </div>

                <span className="text-xs font-semibold text-muted-foreground">
                  {device.signal}%
                </span>

              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, j) => (
                  <div
                    key={j}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      j < Math.ceil(device.signal / 20)
                        ? device.signal > 60
                          ? "bg-success"
                          : device.signal > 30
                          ? "bg-warning"
                          : "bg-destructive"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>

            </div>

            {/* SENSOR VALUES */}

            <div className="space-y-2 text-xs text-muted-foreground mb-3">

              {device.type === "Temperature" && (
                <div className="flex justify-between">
                  <span>Temperature</span>
                  <span className="font-semibold text-foreground">{device.temperature}°C</span>
                </div>
              )}

              {device.type === "Humidity" && (
                <div className="flex justify-between">
                  <span>Humidity</span>
                  <span className="font-semibold text-foreground">{device.humidity}%</span>
                </div>
              )}

              {device.type === "Pressure" && (
                <div className="flex justify-between">
                  <span>Pressure</span>
                  <span className="font-semibold text-foreground">{device.pressure} hPa</span>
                </div>
              )}

              {device.type === "Multi-Sensor" && (
                <div className="flex justify-between">
                  <span>Air Quality</span>
                  <span className="font-semibold text-foreground">{device.airQuality}%</span>
                </div>
              )}

              {device.type === "Motion" && (
                <div className="flex justify-between">
                  <span>Motion</span>
                  <span className="font-semibold text-foreground">
                    {device.motion ? "Detected" : "Not Detected"}
                  </span>
                </div>
              )}

            </div>

            <div className="space-y-2 text-xs text-muted-foreground">

              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                <span>Type: {device.type}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{device.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <HardDrive className="w-3 h-3" />
                <span>Firmware: {device.firmware}</span>
              </div>

            </div>

          </motion.div>

        ))}

      </div>
    </div>
  );
}