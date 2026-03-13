import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSensorData, fetchBlockchainTransactions, generateChartData } from "@/services/api";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { Activity, TrendingUp, Database, Shield } from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
}

interface BlockchainTx {
  hash: string;
  blockNumber: number;
  from: string;
  gasUsed: number;
  timestamp: string;
  verified: boolean;
}

const PIE_COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(160, 60%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(348, 94%, 60%)",
];

export default function AnalyticsPage() {

  const [chartData] = useState(generateChartData(48));
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTx[]>([]);

  useEffect(() => {

    async function load() {

      const sensorData = await fetchSensorData();
      const txData = await fetchBlockchainTransactions();

      setSensors(sensorData);
      setTransactions(txData);

    }

    load();

  }, []);

  const deviceTypeData = [
    { name: "Temperature", value: sensors.filter((s) => s.temperature).length },
    { name: "Humidity", value: sensors.filter((s) => s.humidity).length },
  ];

  const dailyTransactions = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    count: Math.floor(transactions.length / 7) + i,
  }));

  return (

    <div className="space-y-6 animate-slide-in">

      {/* HEADER */}

      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          System performance and blockchain insights
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          { label: "Devices", value: sensors.length, icon: Activity },
          { label: "Blockchain TX", value: transactions.length, icon: Database },
          { label: "Network Uptime", value: "99.9%", icon: TrendingUp },
          { label: "Security Score", value: "A+", icon: Shield },
        ].map((kpi, i) => (

          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-5"
          >

            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-primary" />
              </div>

            </div>

            <p className="text-xs text-muted-foreground">{kpi.label}</p>

            <p className="font-display text-2xl font-bold text-foreground mt-1">
              {kpi.value}
            </p>

          </motion.div>

        ))}

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* SENSOR TREND */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 lg:col-span-2"
        >

          <h3 className="font-display font-semibold text-sm mb-4">
            Sensor Data Trend
          </h3>

          <div className="h-64">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>

                <defs>

                  <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199,89%,48%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(199,89%,48%)" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="gHum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160,60%,45%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(160,60%,45%)" stopOpacity={0} />
                  </linearGradient>

                </defs>

                <CartesianGrid stroke="hsl(var(--border) / 0.24)" vertical={false} />

                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground) / 0.7)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="hsl(var(--muted-foreground) / 0.7)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border) / 0.5)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(199,89%,48%)"
                  fill="url(#gTemp)"
                  strokeWidth={2}
                  dot={false}
                />

                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(160,60%,45%)"
                  fill="url(#gHum)"
                  strokeWidth={2}
                  dot={false}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* DEVICE DISTRIBUTION */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >

          <h3 className="font-display font-semibold text-sm mb-4">
            Device Distribution
          </h3>

          <div className="h-64 flex items-center justify-center">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >

                  {deviceTypeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

      </div>

      {/* BLOCKCHAIN ACTIVITY */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >

        <h3 className="font-display font-semibold text-sm mb-4">
          Daily Blockchain Transactions
        </h3>

        <div className="h-48">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={dailyTransactions} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>

              <CartesianGrid stroke="hsl(var(--border) / 0.24)" vertical={false} />

              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground) / 0.7)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="hsl(var(--muted-foreground) / 0.7)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="hsl(199,89%,48%)"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </motion.div>

    </div>

  );

}