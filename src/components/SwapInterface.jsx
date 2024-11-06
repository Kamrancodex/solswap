import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import TokenSelectModal from "./TokenSelectModal";
import WalletModal from "./WalletModal";
import SlippageModal from "./SlippageModal";
import OrderPreview from "./OrderPreview";
import {
  calculateSwapDetails,
  getTokenBalance,
  executeSwap as jupiterSwap,
  fetchTokenList,
} from "./jupiterUtils";
import { Connection, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";

const SwapInterface = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [selectingField, setSelectingField] = useState(null);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [swapDetails, setSwapDetails] = useState(null);
  const [error, setError] = useState(null);

  const confirmedConnection = React.useMemo(
    () => new Connection(connection.rpcEndpoint, "confirmed"),
    [connection.rpcEndpoint]
  );

  // Load default tokens
  useEffect(() => {
    const loadDefaultTokens = async () => {
      try {
        const tokens = await fetchTokenList();
        if (!tokens || tokens.length === 0) {
          throw new Error("No tokens found");
        }

        // SOL and USDC addresses on mainnet
        const SOL_ADDRESS = "So11111111111111111111111111111111111111112";
        const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

        const solToken = tokens.find((t) => t.address === SOL_ADDRESS);
        const usdcToken = tokens.find((t) => t.address === USDC_ADDRESS);

        if (!solToken || !usdcToken) {
          throw new Error("Default tokens not found");
        }

        setFromToken(solToken);
        setToToken(usdcToken);
      } catch (error) {
        console.error("Error loading tokens:", error);
        setError("Failed to load tokens. Please try refreshing the page.");
      }
    };

    loadDefaultTokens();
  }, []);

  // Update wallet balance
  useEffect(() => {
    const updateBalance = async () => {
      if (publicKey && fromToken) {
        try {
          const balance = await getTokenBalance(
            connection,
            publicKey,
            fromToken
          );
          setWalletBalance(balance);
        } catch (error) {
          console.error("Error updating balance:", error);
          setWalletBalance(0);
        }
      } else {
        setWalletBalance(0);
      }
    };

    updateBalance();
  }, [publicKey, fromToken, connection]);

  // Calculate swap when amount changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (fromAmount && fromToken && toToken && parseFloat(fromAmount) > 0) {
        calculateSwap(fromAmount);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [fromAmount, fromToken, toToken, slippage]);

  const calculateSwap = async (inputAmount) => {
    if (
      !inputAmount ||
      isNaN(parseFloat(inputAmount)) ||
      parseFloat(inputAmount) <= 0
    ) {
      setSwapDetails(null);
      setToAmount("");
      return;
    }

    if (!fromToken || !toToken) {
      setSwapDetails(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const details = await calculateSwapDetails(
        connection,
        fromToken,
        toToken,
        parseFloat(inputAmount),
        slippage
      );

      setSwapDetails({
        ...details,
        price: details.amountOut / parseFloat(inputAmount),
      });
      setToAmount(details.amountOut.toString());
    } catch (error) {
      console.error("Swap calculation error:", error);
      setError("Failed to calculate swap");
      setToAmount("");
      setSwapDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFromAmountChange = (value) => {
    if (
      value === "" ||
      (Number(value) >= 0 && Number(value) <= walletBalance)
    ) {
      setFromAmount(value);
      setError(null);
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setError(null);
  };

  const handleTokenSelect = (token) => {
    if (selectingField === "from") {
      if (token.address === toToken?.address) {
        setToToken(fromToken);
      }
      setFromToken(token);

      setFromAmount("");
    } else {
      if (token.address === fromToken?.address) {
        setFromToken(toToken);
      }
      setToToken(token);
    }
    setToAmount("");
    setSwapDetails(null);
    setError(null);
    setIsTokenSelectOpen(false);
  };

  // Function to check transaction status
  const checkTransaction = async (signatureToCheck) => {
    if (!signatureToCheck) return false;
    try {
      const status = await connection.getSignatureStatus(signatureToCheck);

      if (status?.value?.err) {
        throw new Error("Transaction failed");
      }

      if (
        status?.value?.confirmationStatus === "confirmed" ||
        status?.value?.confirmationStatus === "finalized"
      ) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking status:", error);
      return false;
    }
  };
  const executeSwap = async () => {
    if (!publicKey || !fromToken || !toToken || !fromAmount || !toAmount)
      return;

    const toastId = toast.loading("Preparing swap...");

    try {
      setLoading(true);
      setError(null);

      const result = await jupiterSwap(
        connection,
        {
          publicKey,
          sendTransaction,
        },
        fromToken,
        toToken,
        parseFloat(fromAmount),
        slippage
      );

      if (!result || !result.signature) {
        throw new Error("Failed to get transaction signature");
      }

      const monitorPromise = monitorTransaction(result.signature, toastId);

      setFromAmount("");
      setToAmount("");
      setSwapDetails(null);

      await monitorPromise;
    } catch (error) {
      console.error("Swap execution error:", error);

      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("Transaction cancelled") ||
        error.message?.includes("Transaction was not confirmed") ||
        error.message?.includes("Failed to send transaction")
      ) {
        setError("Swap cancelled");
        toast.error("Swap cancelled by user", { id: toastId });

        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        setError("Failed to execute swap");
        toast.error("Failed to execute swap", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };
  const monitorTransaction = async (signatureToMonitor, toastId) => {
    if (!signatureToMonitor) {
      console.error("No signature provided to monitor");
      return;
    }

    try {
      toast.loading("Processing transaction...", { id: toastId });

      let attempts = 0;
      const maxAttempts = 45;

      while (attempts < maxAttempts) {
        try {
          const status = await connection.getSignatureStatus(
            signatureToMonitor
          );

          if (status?.value?.err) {
            toast.error(`Transaction failed: ${status.value.err.toString()}`, {
              id: toastId,
            });
            return;
          }

          if (
            status?.value?.confirmationStatus === "confirmed" ||
            status?.value?.confirmationStatus === "finalized"
          ) {
            toast.success("Swap completed successfully!", { id: toastId });

            const balance = await getTokenBalance(
              connection,
              publicKey,
              fromToken
            );
            setWalletBalance(balance);
            return;
          }

          toast.loading(`Processing (${attempts + 1}/${maxAttempts})`, {
            id: toastId,
          });

          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Error checking status:", error);
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      toast.error(
        "Transaction sent but confirmation timed out. Check Solscan for status.",
        {
          id: toastId,
          duration: 7000,
        }
      );
    } catch (error) {
      console.error("Error monitoring transaction:", error);
      toast.error("Error monitoring transaction", {
        id: toastId,
        duration: 7000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1114] p-4 md:p-8">
      <div className="max-w-[480px] mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#7EBAFF] text-lg font-medium">Swap</span>
          </div>
          <button
            onClick={() => setIsSlippageModalOpen(true)}
            className="flex items-center gap-2 text-[#7EBAFF] hover:bg-[#2C2F36] px-3 py-1.5 rounded-lg transition-colors"
          >
            <span className="text-gray-400">Slippage</span>
            <span>{slippage}%</span>
          </button>
        </div>

        {/* Swap Container */}
        <div className="bg-[#1A1C24] rounded-2xl p-4">
          {/* From Section */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">From</span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleFromAmountChange((walletBalance * 0.5).toString())
                  }
                  disabled={!walletBalance}
                  className="px-2 py-1 rounded bg-[#2C2F36] text-gray-400 text-sm hover:bg-[#363A45] disabled:opacity-50"
                >
                  50%
                </button>
                <button
                  onClick={() =>
                    handleFromAmountChange(walletBalance.toString())
                  }
                  disabled={!walletBalance}
                  className="px-2 py-1 rounded bg-[#2C2F36] text-gray-400 text-sm hover:bg-[#363A45] disabled:opacity-50"
                >
                  Max
                </button>
              </div>
            </div>
            <div className="bg-[#2C2F36] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="any"
                  className="bg-transparent text-white text-2xl outline-none w-[150px]"
                />
                <button
                  onClick={() => {
                    setSelectingField("from");
                    setIsTokenSelectOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#1A1C24] rounded-full px-4 py-2"
                >
                  {fromToken ? (
                    <>
                      <img
                        src={fromToken.logoURI}
                        alt={fromToken.symbol}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/fallback-token-icon.png";
                        }}
                      />
                      <span className="text-white">{fromToken.symbol}</span>
                    </>
                  ) : (
                    <span className="text-white">Select Token</span>
                  )}
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Balance: {walletBalance?.toFixed(6)} {fromToken?.symbol}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {loading
                  ? "Loading..."
                  : `~$${(fromAmount * (swapDetails?.price || 0)).toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-2">
            <button
              onClick={handleSwapTokens}
              disabled={!fromToken || !toToken}
              className="bg-[#2C2F36] p-2 rounded-full hover:bg-[#363A45] disabled:opacity-50"
            >
              <svg
                className="w-6 h-6 text-[#7EBAFF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>

          {/* To Section */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">To</span>
            </div>
            <div className="bg-[#2C2F36] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <input
                  type="number"
                  value={toAmount}
                  readOnly
                  placeholder="0"
                  className="bg-transparent text-white text-2xl outline-none w-[150px]"
                />
                <button
                  onClick={() => {
                    setSelectingField("to");
                    setIsTokenSelectOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#1A1C24] rounded-full px-4 py-2"
                >
                  {toToken ? (
                    <>
                      <img
                        src={toToken.logoURI}
                        alt={toToken.symbol}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/fallback-token-icon.png";
                        }}
                      />
                      <span className="text-white">{toToken.symbol}</span>
                    </>
                  ) : (
                    <span className="text-white">Select Token</span>
                  )}
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {loading
                  ? "Loading..."
                  : `~$${(toAmount * (swapDetails?.price || 0)).toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Show swap details if available */}
          {swapDetails && fromAmount && toAmount && (
            <OrderPreview
              fromToken={fromToken}
              toToken={toToken}
              fromAmount={fromAmount}
              toAmount={toAmount}
              priceImpact={swapDetails.priceImpact}
              minimumReceived={swapDetails.minimumReceived}
              fees={isNaN(swapDetails.fees) ? "0.0000" : swapDetails.fees}
              routes={swapDetails.routes}
            />
          )}

          {/* Swap Button */}
          <button
            onClick={() =>
              publicKey ? executeSwap() : setWalletModalOpen(true)
            }
            disabled={
              loading ||
              !fromAmount ||
              !toAmount ||
              parseFloat(fromAmount) > walletBalance ||
              !fromToken ||
              !toToken ||
              !!error
            }
            className="w-full bg-[#7EBAFF] hover:bg-[#6BA8FF] text-[#1A1C24] font-medium 
                     rounded-xl py-4 mt-4 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Calculating..."
              : !publicKey
              ? "Connect Wallet"
              : parseFloat(fromAmount) > walletBalance
              ? "Insufficient Balance"
              : error
              ? "Price Impact Too High"
              : "Swap"}
          </button>
        </div>

        {/* Modals */}
        <SlippageModal
          isOpen={isSlippageModalOpen}
          onClose={() => setIsSlippageModalOpen(false)}
          slippage={slippage}
          setSlippage={setSlippage}
        />

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setWalletModalOpen(false)}
        />

        <TokenSelectModal
          isOpen={isTokenSelectOpen}
          onClose={() => setIsTokenSelectOpen(false)}
          onSelect={handleTokenSelect}
          fromToken={fromToken}
          toToken={toToken}
          selectingField={selectingField}
        />
      </div>
    </div>
  );
};

export default SwapInterface;
