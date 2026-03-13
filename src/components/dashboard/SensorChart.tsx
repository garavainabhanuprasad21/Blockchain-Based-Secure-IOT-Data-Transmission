import { motion } from "framer-motion";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface SensorChartProps {
  title: string;
  data: Array<{ time: string; temperature: number; humidity: number }>;
  dataKey: "temperature" | "humidity";
}

export default function SensorChart({ title, data, dataKey }: SensorChartProps) {
  const color = dataKey === "temperature" ? "hsl(var(--primary))" : "hsl(var(--success))";
  const gradientId = `gradient-${dataKey}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5"
    >
      <h3 className="font-display font-semibold text-foreground text-sm mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.24} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border) / 0.24)" vertical={false} />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground) / 0.7)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground) / 0.7)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border) / 0.35)", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border) / 0.5)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
