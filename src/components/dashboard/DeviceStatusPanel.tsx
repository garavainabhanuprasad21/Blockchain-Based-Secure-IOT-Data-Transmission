import { motion } from "framer-motion";
import { Wifi, WifiOff, BatteryCharging, Battery, BatteryLow, Signal, SignalLow, SignalZero } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Device {
  id: string;
  name: string;
  status: "active" | "offline" | "charging";
  battery: number;
  signal: number;
  lastUpdate: string;
}

function getBatteryIcon(battery: number, status: string) {
  if (status === "charging") return <BatteryCharging className="w-3 h-3 text-success" />;
  if (battery <= 15) return <BatteryLow className="w-3 h-3 text-destructive" />;
  return <Battery className="w-3 h-3 text-muted-foreground" />;
}

function getSignalIcon(signal: number) {
  if (signal <= 20) return <SignalZero className="w-3 h-3 text-destructive" />;
  if (signal <= 50) return <SignalLow className="w-3 h-3 text-warning" />;
  return <Signal className="w-3 h-3 text-success" />;
}

function getBatteryColor(battery: number) {
  if (battery <= 15) return "text-destructive";
  if (battery <= 40) return "text-warning";
  return "text-success";
}

export default function DeviceStatusPanel({ devices }: { devices: Device[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card"
    >
      <div className="p-5 border-b border-border">
        <h3 className="font-display font-semibold text-foreground text-sm">Device Status</h3>
      </div>
      <div className="p-3 space-y-1">
        {devices.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                d.status === "active" ? "bg-success/10" :
                d.status === "charging" ? "bg-warning/10" : "bg-destructive/10"
              )}>
                {d.status === "active"
                  ? <Wifi className="w-4 h-4 text-success" />
                  : d.status === "charging"
                  ? <BatteryCharging className="w-4 h-4 text-warning" />
                  : <WifiOff className="w-4 h-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{d.id}</p>
                <p className="text-[10px] text-muted-foreground">{d.name}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                d.status === "active" ? "bg-success/10 text-success" :
                d.status === "charging" ? "bg-warning/10 text-warning" :
                "bg-destructive/10 text-destructive"
              )}>
                {d.status === "active" ? "Active" : d.status === "charging" ? "Charging" : "Offline"}
              </span>
              <div className="flex items-center gap-2 justify-end">
                <div className="flex items-center gap-1">
                  {getBatteryIcon(d.battery, d.status)}
                  <span className={cn("text-[10px] font-semibold", getBatteryColor(d.battery))}>{d.battery}%</span>
                </div>
                <div className="flex items-center gap-1">
                  {getSignalIcon(d.signal)}
                  <span className="text-[10px] text-muted-foreground">{d.signal}%</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(d.lastUpdate), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
