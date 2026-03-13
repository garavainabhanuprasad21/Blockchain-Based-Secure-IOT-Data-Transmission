import { Bell, User, CheckCheck, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function TopNavbar() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 sticky top-0 z-20 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      <h2 className="font-display font-semibold text-foreground text-sm md:text-base">
        Blockchain-Based Secure IoT Data Transmission
      </h2>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-warning" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-popover border-border" align="end">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="font-display font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-muted-foreground text-sm">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 border-b border-border/50 hover:bg-muted/50 transition-colors",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        n.type === "success" && "bg-success",
                        n.type === "warning" && "bg-warning",
                        n.type === "error" && "bg-destructive",
                        n.type === "info" && "bg-primary"
                      )} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(n.time, { addSuffix: true })}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground leading-tight">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
