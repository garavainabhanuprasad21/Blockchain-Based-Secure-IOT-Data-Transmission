import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Copy } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Transaction {
  hash: string;
  blockNumber: number;
  timestamp: string;
  verified: boolean;
}

export default function BlockchainTable({ data }: { data: Transaction[] }) {
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-5 border-b border-border">
        <h3 className="font-display font-semibold text-foreground text-sm">Blockchain Transactions</h3>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wider">Tx Hash</th>
              <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wider">Block</th>
              <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wider">Timestamp</th>
              <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, i) => (
              <tr key={tx.hash} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3">
                  <button onClick={() => copyHash(tx.hash)} className="flex items-center gap-2 group font-display text-xs text-primary hover:text-primary/80">
                    <span>{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </td>
                <td className="px-5 py-3 font-display text-xs text-foreground">#{tx.blockNumber}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{format(new Date(tx.timestamp), "MMM dd, HH:mm:ss")}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                    tx.verified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {tx.verified ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {tx.verified ? "Verified" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
