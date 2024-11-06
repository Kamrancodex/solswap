import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletModal from "./WalletModal";

const Header = () => {
  const { publicKey, disconnect } = useWallet();
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="w-full bg-[#1A1C24] px-4 md:px-6 py-4 border-b border-[#2C2F36]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl md:text-2xl font-bold text-[#7EBAFF]">
            SolSwap
          </span>
        </div>

        {publicKey ? (
          <div className="flex items-center gap-2">
            <span className="text-white">
              {formatAddress(publicKey.toString())}
            </span>
            <button
              onClick={disconnect}
              className="bg-[#2C2F36] hover:bg-[#363A45] text-[#7EBAFF] font-medium
                       px-4 md:px-6 py-2 rounded-xl text-sm md:text-base
                       transition-colors duration-200"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => setWalletModalOpen(true)}
            className="bg-[#7EBAFF] hover:bg-[#6BA8FF] text-[#1A1C24] font-medium
                     px-4 md:px-6 py-2 rounded-xl text-sm md:text-base
                     transition-colors duration-200"
          >
            Connect Wallet
          </button>
        )}

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setWalletModalOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
