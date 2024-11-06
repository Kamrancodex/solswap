import { useState } from "react";

const SlippageModal = ({ isOpen, onClose, slippage, setSlippage }) => {
  const [customSlippage, setCustomSlippage] = useState("");

  const handleSlippageSelect = (value) => {
    setSlippage(value);
    setCustomSlippage("");
  };

  const handleCustomSlippage = (value) => {
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setCustomSlippage(value);
      if (value !== "") {
        setSlippage(Number(value));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1C24] rounded-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-medium">
            Set Slippage Tolerance
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[0.5, 1, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleSlippageSelect(value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                slippage === value
                  ? "bg-[#7EBAFF] text-[#1A1C24]"
                  : "bg-[#2C2F36] text-white hover:bg-[#363A45]"
              }`}
            >
              {value}%
            </button>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 bg-[#2C2F36] rounded-lg p-2">
            <input
              type="number"
              value={customSlippage}
              onChange={(e) => handleCustomSlippage(e.target.value)}
              placeholder="Custom"
              className="bg-transparent text-white outline-none w-full"
            />
            <span className="text-gray-400">%</span>
          </div>
        </div>

        {Number(slippage) > 5 && (
          <div className="text-red-500 text-sm mb-4">
            High slippage increases the risk of price impact
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-[#7EBAFF] hover:bg-[#6BA8FF] text-[#1A1C24] rounded-lg py-2 font-medium transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SlippageModal;
