import { motion } from "framer-motion";
import { Thermometer, Droplets, Wifi, WifiOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  type: "temperature" | "humidity" | "status" | "activity";
  status?: "active" | "offline";
  index?: number;
}

const ICONS = {
  temperature: Thermometer,
  humidity: Droplets,
  status: Wifi,
  activity: Activity,
};

export default function SensorCard({ title, value, unit, type, status = "active", index = 0 }: SensorCardProps) {
  const Icon = type === "status" && status === "offline" ? WifiOff : ICONS[type];
  const isOffline = status === "offline";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn("glass-card-hover p-5", isOffline && "opacity-70")}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          type === "temperature" && "bg-primary/10",
          type === "humidity" && "bg-accent/10",
          type === "status" && (isOffline ? "bg-destructive/10" : "bg-success/10"),
          type === "activity" && "bg-warning/10"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            type === "temperature" && "text-primary",
            type === "humidity" && "text-accent",
            type === "status" && (isOffline ? "text-destructive" : "text-success"),
            type === "activity" && "text-warning"
          )} />
        </div>
        <span className={cn(
          "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
          isOffline ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
        )}>
          {isOffline ? "Offline" : "Live"}
        </span>
      </div>
      <p className="text-muted-foreground text-xs mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-foreground">{value}</span>
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>
    </motion.div>
  );
}
