import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  time: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const ALERT_TEMPLATES = [
  { title: "Temperature Spike", message: "Sensor IoT-001 detected temperature spike to {val}°C", type: "warning" as const },
  { title: "Humidity Alert", message: "Humidity level on IoT-002 exceeded {val}%", type: "warning" as const },
  { title: "Device Online", message: "Sensor Node {device} is back online", type: "success" as const },
  { title: "Device Offline", message: "Edge Device {device} went offline unexpectedly", type: "error" as const },
  { title: "Block Verified", message: "Transaction 0x{hash}...verified on blockchain", type: "info" as const },
  { title: "Firmware Update", message: "Device {device} firmware updated to v{val}", type: "success" as const },
  { title: "Low Battery", message: "Device {device} battery at {val}%", type: "warning" as const },
  { title: "Data Synced", message: "All sensor data synced to blockchain ledger", type: "info" as const },
  { title: "Connection Restored", message: "Gateway Gamma connection restored after {val}s downtime", type: "success" as const },
  { title: "Anomaly Detected", message: "Unusual reading pattern detected on {device}", type: "error" as const },
];

const DEVICES = ["IoT-001", "IoT-002", "IoT-003", "IoT-004", "IoT-005"];

function generateRandomAlert(): Omit<Notification, "id" | "time" | "read"> {
  const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  const val = Math.floor(20 + Math.random() * 60);
  const hash = Math.random().toString(16).slice(2, 10);
  const message = template.message
    .replace("{device}", device)
    .replace("{val}", String(val))
    .replace("{hash}", hash);
  return { title: template.title, message, type: template.type };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((n: Omit<Notification, "id" | "time" | "read">) => {
    setNotifications((prev) => [{ ...n, id: crypto.randomUUID(), time: new Date(), read: false }, ...prev].slice(0, 50));
  }, []);

  // Generate initial notifications
  useEffect(() => {
    const initial: Notification[] = Array.from({ length: 3 }, () => {
      const alert = generateRandomAlert();
      return { ...alert, id: crypto.randomUUID(), time: new Date(Date.now() - Math.random() * 600000), read: false };
    });
    setNotifications(initial);
  }, []);

  // Auto-generate realistic alerts every 8-15 seconds
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000;
      return setTimeout(() => {
        addNotification(generateRandomAlert());
        timerRef = scheduleNext();
      }, delay);
    };
    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
