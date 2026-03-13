import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, AlertCircle, Loader2, Cpu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("All fields are required"); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError("Invalid credentials. Use an authorized account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 glow-primary">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">IoTChain</h1>
          <p className="text-muted-foreground text-sm mt-1">Blockchain-Based Secure IoT Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@iotchain.io" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-muted/50 border-border focus:border-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-sm">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-muted/50 border-border focus:border-primary" />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
            {loading ? "Authenticating..." : "Secure Login"}
          </Button>
        </form>

        {/* <div className="mt-6 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-muted-foreground text-[10px] font-display font-semibold mb-2 uppercase tracking-wider">Authorized Accounts</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="text-foreground">admin@iotchain.io</span> / admin123 — <span className="text-primary">Admin</span></p>
            <p><span className="text-foreground">engineer@iotchain.io</span> / eng2024 — <span className="text-accent">Engineer</span></p>
            <p><span className="text-foreground">analyst@iotchain.io</span> / analyst2024 — <span className="text-warning">Analyst</span></p>
            <p><span className="text-foreground">manager@iotchain.io</span> / mgr2024 — <span className="text-success">Manager</span></p>
          </div>
        </div> */}
      </motion.div>
    </div>
  );
}
