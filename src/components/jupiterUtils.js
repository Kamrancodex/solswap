// jupiterUtils.js
import { VersionedTransaction, Transaction, PublicKey } from "@solana/web3.js"; // Ensure this is up-to-date

export const fetchTokenList = async () => {
  try {
    const response = await fetch("https://token.jup.ag/strict");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Jupiter API returns tokens directly
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

export const calculateSwapDetails = async (
  connection,
  fromToken,
  toToken,
  amount,
  slippage
) => {
  // Add minimum amount check (example: $0.01 equivalent)
  const MIN_AMOUNT = 0.01;
  if (amount < MIN_AMOUNT) {
    throw new Error(`Minimum amount is ${MIN_AMOUNT} ${fromToken.symbol}`);
  }

  try {
    // Convert amount to proper decimals
    const inputAmount = Math.floor(amount * Math.pow(10, fromToken.decimals));

    // Get quote
    const response = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${
        fromToken.address
      }&outputMint=${toToken.address}&amount=${inputAmount}&slippageBps=${
        slippage * 100
      }`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch quote: ${errorData.message || "Unknown error"}`
      );
    }

    const quoteResponse = await response.json();

    if (!quoteResponse || !quoteResponse.outAmount) {
      throw new Error("No route found for this swap");
    }

    const outAmount = quoteResponse.outAmount / Math.pow(10, toToken.decimals);
    const price = outAmount / amount;
    const priceImpact = parseFloat(quoteResponse.priceImpactPct).toFixed(2);

    return {
      amountOut: outAmount,
      minimumReceived:
        quoteResponse.otherAmountThreshold / Math.pow(10, toToken.decimals),
      priceImpact,
      fees: (quoteResponse.feeBps / 100).toFixed(4),
      price,
      routes:
        quoteResponse.routePlan?.map((route) => ({
          name: route.swapInfo.label,
          percent: route.percent,
        })) || [],
    };
  } catch (error) {
    console.error("Error calculating swap:", error);
    throw error;
  }
};

export const executeSwap = async (
  connection,
  wallet,
  fromToken,
  toToken,
  amount,
  slippage
) => {
  try {
    const inputAmount = Math.floor(amount * Math.pow(10, fromToken.decimals));

    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${
        fromToken.address
      }&outputMint=${toToken.address}&amount=${inputAmount}&slippageBps=${
        slippage * 100
      }&onlyDirectRoutes=true`
    );

    if (!quoteResponse.ok) {
      const errorData = await quoteResponse.json();
      throw new Error(
        `Failed to fetch swap quote: ${errorData.message || "Unknown error"}`
      );
    }

    const quote = await quoteResponse.json();

    const swapRequestResponse = await fetch(
      "https://quote-api.jup.ag/v6/swap",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: wallet.publicKey.toString(),
          wrapUnwrapSOL: true,
          computeUnitPriceMicroLamports: 50000,
          asLegacyTransaction: true,
        }),
      }
    );

    if (!swapRequestResponse.ok) {
      const errorData = await swapRequestResponse.json();
      throw new Error(
        `Swap request failed: ${errorData.message || "Unknown error"}`
      );
    }

    const swapResponse = await swapRequestResponse.json();
    const { swapTransaction } = swapResponse;

    const transaction = Transaction.from(
      Buffer.from(swapTransaction, "base64")
    );

    const signature = await wallet.sendTransaction(transaction, connection, {
      skipPreflight: true,
      maxRetries: 3,
      preflightCommitment: "confirmed",
    });

    return { signature, quote };
  } catch (error) {
    console.error("Swap execution error:", error);
    throw error;
  }
};

export const getTokenBalance = async (connection, publicKey, token) => {
  if (!publicKey || !token) return 0;

  try {
    if (token.symbol === "SOL") {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9;
    }

    const mintPubkey = new PublicKey(token.address);

    const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: mintPubkey,
    });

    if (!response.value.length) {
      return 0;
    }

    const balance = response.value[0].account.data.parsed.info.tokenAmount;
    return balance.uiAmount || 0;
  } catch (error) {
    console.error("Error getting token balance:", error);

    return 0;
  }
};

// Optional: Helper function to format balances
export const formatBalance = (balance, decimals = 6) => {
  if (!balance) return "0";
  return parseFloat(balance).toFixed(decimals);
};
