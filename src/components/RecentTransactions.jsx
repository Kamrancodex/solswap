import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const RecentTransactions = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("global"); // 'global' or 'personal'

  // Jupiter Program ID for tracking swaps
  const JUPITER_PROGRAM_ID = new PublicKey(
    "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB"
  );

  // Format date helper function
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const determineTransactionType = (tx) => {
    if (!tx) return "unknown";
    try {
      const logMessages = tx.meta?.logMessages || [];
      if (logMessages.some((msg) => msg.includes("Swap"))) return "swap";
      if (logMessages.some((msg) => msg.includes("Transfer")))
        return "transfer";
      return "unknown";
    } catch (error) {
      console.error("Error determining transaction type:", error);
      return "unknown";
    }
  };

  const extractTokenInfo = (tx) => {
    try {
      const preTokenBalances = tx?.meta?.preTokenBalances || [];
      const postTokenBalances = tx?.meta?.postTokenBalances || [];
      const logMessages = tx?.meta?.logMessages || [];

      // Try to find swap-related messages
      const swapMessage = logMessages.find((msg) => msg.includes("Swap"));

      return {
        fromToken: preTokenBalances[0]?.mint || "unknown",
        toToken: postTokenBalances[0]?.mint || "unknown",
        fromAmount: preTokenBalances[0]?.uiTokenAmount?.uiAmount || "...",
        toAmount: postTokenBalances[0]?.uiTokenAmount?.uiAmount || "...",
        user:
          tx?.transaction?.message?.accountKeys[0]?.pubkey?.toString() ||
          "unknown",
        type: swapMessage ? "swap" : "unknown",
      };
    } catch (error) {
      console.error("Error extracting token info:", error);
      return {
        fromToken: "unknown",
        toToken: "unknown",
        fromAmount: "...",
        toAmount: "...",
        user: "unknown",
        type: "unknown",
      };
    }
  };

  useEffect(() => {
    const fetchGlobalTransactions = async () => {
      try {
        setLoading(true);
        const signatures = await connection.getSignaturesForAddress(
          JUPITER_PROGRAM_ID,
          { limit: 10 }
        );

        const txDetails = await Promise.all(
          signatures.map(async (sig) => {
            const tx = await connection.getParsedTransaction(sig.signature);
            const tokenInfo = extractTokenInfo(tx);
            return {
              signature: sig.signature,
              timestamp: sig.blockTime
                ? new Date(sig.blockTime * 1000)
                : new Date(),
              status: sig.confirmationStatus,
              ...tokenInfo,
            };
          })
        );

        setTransactions(txDetails);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPersonalTransactions = async () => {
      if (!publicKey) return;
      try {
        setLoading(true);
        const signatures = await connection.getSignaturesForAddress(publicKey, {
          limit: 5,
        });

        const txDetails = await Promise.all(
          signatures.map(async (sig) => {
            const tx = await connection.getParsedTransaction(sig.signature);
            const tokenInfo = extractTokenInfo(tx);
            return {
              signature: sig.signature,
              timestamp: sig.blockTime
                ? new Date(sig.blockTime * 1000)
                : new Date(),
              status: sig.confirmationStatus,
              ...tokenInfo,
            };
          })
        );

        setTransactions(txDetails);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (viewMode === "global") {
      fetchGlobalTransactions();
      const interval = setInterval(fetchGlobalTransactions, 30000);
      return () => clearInterval(interval);
    } else {
      fetchPersonalTransactions();
      const interval = setInterval(fetchPersonalTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey, connection, viewMode]);

  return (
    <div className="bg-[#1A1C24] rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white text-lg font-medium">Recent Swaps</span>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("global")}
            className={`px-3 py-1 rounded-lg ${
              viewMode === "global"
                ? "bg-[#7EBAFF] text-[#1A1C24]"
                : "bg-[#2C2F36] text-gray-400"
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setViewMode("personal")}
            className={`px-3 py-1 rounded-lg ${
              viewMode === "personal"
                ? "bg-[#7EBAFF] text-[#1A1C24]"
                : "bg-[#2C2F36] text-gray-400"
            }`}
          >
            My Swaps
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No recent transactions
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.signature}
              className="flex justify-between items-center p-3 bg-[#2C2F36] rounded-lg hover:bg-[#363A45] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#7EBAFF]/10">
                  <svg
                    className="w-4 h-4 text-[#7EBAFF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-white">
                    {tx.type === "swap" ? (
                      <span>
                        {tx.fromAmount} → {tx.toAmount}
                      </span>
                    ) : (
                      tx.type
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(tx.timestamp)}
                  </div>
                  {viewMode === "global" && (
                    <div className="text-sm text-gray-400">
                      {tx.user.slice(0, 4)}...{tx.user.slice(-4)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`https://solscan.io/tx/${tx.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7EBAFF] hover:underline text-sm"
                >
                  View
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
