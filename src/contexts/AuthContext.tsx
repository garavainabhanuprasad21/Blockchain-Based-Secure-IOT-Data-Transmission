import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CREDENTIALS = [
  { email: "admin@iotchain.io", password: "admin123", name: "Dr. Sarah Chen", role: "System Admin" },
  { email: "demo@iotchain.io", password: "demo123", name: "Demo User", role: "Demo" },
  { email: "user@123", password: "user123", name: "User 1", role: "User1" },
  { email: "user@456", password: "user456", name: "User 2", role: "User2" },
  { email: "user@789", password: "user789", name: "User 3", role: "User3" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = VALID_CREDENTIALS.find((c) => c.email === email && c.password === password);
    if (found) {
      setUser({ id: crypto.randomUUID(), name: found.name, email: found.email, role: found.role });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
