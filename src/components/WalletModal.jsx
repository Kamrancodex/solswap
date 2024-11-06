import React, { useState, useMemo, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const WalletModal = ({ isOpen, onClose }) => {
  const { select, wallet, connect, connecting, connected, publicKey } =
    useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  const handleWalletSelect = async (wallet) => {
    try {
      setIsConnecting(true);
      select(wallet.name);
      await connect();
      onClose();
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const isPhantomInstalled = useMemo(
    () => typeof window !== "undefined" && window.phantom?.solana?.isPhantom,
    []
  );

  const isSolflareInstalled = useMemo(
    () => typeof window !== "undefined" && window.solflare?.isSolflare,
    []
  );

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#1A1C24] p-6 rounded-lg w-full max-w-md mx-4 md:mx-auto text-white">
          <h2 className="text-xl font-semibold mb-4">Connect a Wallet</h2>

          {!isPhantomInstalled && (
            <div
              className="flex items-center p-3 mb-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 cursor-pointer"
              onClick={() => window.open("https://phantom.app/", "_blank")}
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 128 128">
                  <path
                    d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"
                    fill="#AB9FF2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-medium text-white">Get Phantom Wallet</p>
                <p className="text-sm text-gray-200">
                  Available on iOS, Android, and Chrome
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 mt-4">
            <div
              className={`flex items-center p-4 rounded-lg ${
                isPhantomInstalled
                  ? "bg-[#2C2F36] hover:bg-[#363A45] cursor-pointer"
                  : "bg-[#2C2F36] opacity-50 cursor-not-allowed"
              }`}
              onClick={() =>
                isPhantomInstalled && handleWalletSelect(wallets[0])
              }
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 128 128">
                  <path
                    d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"
                    fill="#AB9FF2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-medium">Phantom</p>
                <p className="text-sm text-gray-400">
                  {isPhantomInstalled ? "Detected" : "Not Installed"}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center p-4 rounded-lg ${
                isSolflareInstalled
                  ? "bg-[#2C2F36] hover:bg-[#363A45] cursor-pointer"
                  : "bg-[#2C2F36] opacity-50 cursor-not-allowed"
              }`}
              onClick={() =>
                isSolflareInstalled && handleWalletSelect(wallets[1])
              }
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16c8.837 0 16-7.163 16-16S24.837 0 16 0z"
                    fill="#FC9965"
                  />
                  <path
                    d="M16.5 5.5c-6.904 0-12.5 5.596-12.5 12.5s5.596 12.5 12.5 12.5 12.5-5.596 12.5-12.5S23.404 5.5 16.5 5.5zm0 22.75c-5.66 0-10.25-4.59-10.25-10.25S10.84 7.75 16.5 7.75s10.25 4.59 10.25 10.25-4.59 10.25-10.25 10.25z"
                    fill="#FCC29A"
                  />
                  <path
                    d="M16.5 10c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14.75c-3.728 0-6.75-3.022-6.75-6.75s3.022-6.75 6.75-6.75 6.75 3.022 6.75 6.75-3.022 6.75-6.75 6.75z"
                    fill="#FC9965"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-medium">Solflare</p>
                <p className="text-sm text-gray-400">
                  {isSolflareInstalled ? "Detected" : "Not Installed"}
                </p>
              </div>
            </div>
          </div>

          <footer className="text-sm text-gray-400 mt-6 text-center">
            By connecting a wallet, you agree to our{" "}
            <a href="#terms" className="text-[#7EBAFF]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="text-[#7EBAFF]">
              Privacy Policy
            </a>
          </footer>

          <button
            className="mt-4 w-full bg-[#7EBAFF] hover:bg-[#6BA8FF] text-[#1A1C24] font-medium py-3 rounded-xl transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default WalletModal;
