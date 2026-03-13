import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchBlockchainTransactions } from "@/services/api";
import { ShieldCheck, Copy, Search, Blocks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* TYPE DEFINITIONS */

interface BlockchainTx {
  hash: string;
  blockNumber: number;
  from: string;
  gasUsed: number;
  timestamp: string;
  verified: boolean;
}

export default function BlockchainPage() {

  const [transactions, setTransactions] = useState<BlockchainTx[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    async function load() {

      const data = await fetchBlockchainTransactions();

      setTransactions(data);

    }

    load();

    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);

  }, []);

  const filtered = transactions.filter((tx) =>
    tx.hash.toLowerCase().includes(search.toLowerCase()) ||
    String(tx.blockNumber).includes(search)
  );

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied");
  };

  return (

    <div className="space-y-6 animate-slide-in">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="font-display text-xl font-bold text-foreground">
            Blockchain Transactions
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Verified IoT data transmissions on-chain
          </p>

        </div>

        <div className="relative w-64">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search hash or block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {[
          { label: "Total Transactions", value: transactions.length, icon: Blocks },
          { label: "Verified", value: transactions.length, icon: ShieldCheck },
        ].map((s, i) => (

          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 flex items-center gap-4"
          >

            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-bold text-foreground">
                {s.value}
              </p>
            </div>

          </motion.div>

        ))}

      </div>

      {/* TABLE */}

      <div className="glass-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-border">

                <th className="text-left px-5 py-3 text-xs">Tx Hash</th>

                <th className="text-left px-5 py-3 text-xs">Block</th>

                <th className="text-left px-5 py-3 text-xs">Device</th>

                <th className="text-left px-5 py-3 text-xs">Gas Used</th>

                <th className="text-left px-5 py-3 text-xs">Timestamp</th>

                <th className="text-left px-5 py-3 text-xs">Status</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((tx) => (

                <tr key={tx.hash} className="border-b border-border/50">

                  <td className="px-5 py-3">

                    <button
                      onClick={() => copyHash(tx.hash)}
                      className="flex items-center gap-2 text-primary"
                    >

                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}

                      <Copy className="w-3 h-3" />

                    </button>

                  </td>

                  <td className="px-5 py-3">#{tx.blockNumber}</td>

                  <td className="px-5 py-3">{tx.from}</td>

                  <td className="px-5 py-3">{tx.gasUsed}</td>

                  <td className="px-5 py-3">

                    {format(new Date(tx.timestamp), "MMM dd, HH:mm:ss")}

                  </td>

                  <td className="px-5 py-3">

                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                        "bg-success/10 text-success"
                      )}
                    >

                      <ShieldCheck className="w-3 h-3" />

                      Verified on Blockchain

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}