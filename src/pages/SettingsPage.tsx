import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Bell, Shield, Database, Globe, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [apiUrl, setApiUrl] = useState("http://localhost:3001/api");
  const [blockchainRpc, setBlockchainRpc] = useState("https://mainnet.infura.io/v3/");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [tempThreshold, setTempThreshold] = useState("35");

  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <div className="space-y-6 animate-slide-in max-w-4xl">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your IoTChain platform</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">General</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Security</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">API Config</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Display Name</Label>
                <Input defaultValue={user?.name} className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Email</Label>
                <Input defaultValue={user?.email} className="bg-muted/50 border-border" disabled />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Role</Label>
                <Input defaultValue={user?.role} className="bg-muted/50 border-border" disabled />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Organization</Label>
                <Input defaultValue="IoTChain Research Lab" className="bg-muted/50 border-border" />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Alert Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div><p className="text-sm font-medium text-foreground">Email Notifications</p><p className="text-xs text-muted-foreground">Receive alerts via email</p></div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div><p className="text-sm font-medium text-foreground">Push Notifications</p><p className="text-xs text-muted-foreground">Browser push alerts</p></div>
                <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Temperature Alert Threshold (°C)</Label>
                <Input type="number" value={tempThreshold} onChange={(e) => setTempThreshold(e.target.value)} className="bg-muted/50 border-border w-32" />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" /> Save Preferences
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div><p className="text-sm font-medium text-foreground">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div><p className="text-sm font-medium text-foreground">Blockchain Data Encryption</p><p className="text-xs text-muted-foreground">Encrypt sensor data before on-chain storage</p></div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="30" className="bg-muted/50 border-border w-32" />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" /> Save Security Settings
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="api">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-6">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> API Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Backend API URL</Label>
                <Input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="bg-muted/50 border-border font-display text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Blockchain RPC Endpoint</Label>
                <Input value={blockchainRpc} onChange={(e) => setBlockchainRpc(e.target.value)} className="bg-muted/50 border-border font-display text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Data Polling Interval (seconds)</Label>
                <Input type="number" defaultValue="5" className="bg-muted/50 border-border w-32" />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" /> Save API Config
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
