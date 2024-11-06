import Header from "./components/Header";
import SwapInterface from "./components/SwapInterface";
import RecentTransactions from "./components/RecentTransactions";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(
    () =>
      "https://solana-mainnet.g.alchemy.com/v2/IGOd_yZwfyNw079UjTS9X4gjEaPawIKh",
    []
  );

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <div className="min-h-screen bg-[#0F1114] flex flex-col">
          <Header />

          {/* Main Content */}
          <main className="flex-grow">
            {/* Swap and Recent Transactions Section */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
                <div className="lg:col-span-1">
                  <SwapInterface />
                </div>
                <div className="lg:col-span-1">
                  <RecentTransactions />
                </div>
              </div>
            </div>

            {/* FAQ Section - Full Width */}
            <div className="w-full bg-[#0F1114] py-12">
              <FAQ />
            </div>
          </main>

          {/* Footer - Full Width */}
          <Footer />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1A1C24",
                color: "#fff",
                borderRadius: "12px",
                border: "1px solid #2C2F36",
              },
              success: {
                duration: 5000,
                iconTheme: {
                  primary: "#7EBAFF",
                  secondary: "#1A1C24",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#1A1C24",
                },
              },
              loading: {
                iconTheme: {
                  primary: "#7EBAFF",
                  secondary: "#1A1C24",
                },
              },
            }}
          />
        </div>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
