const OrderPreview = ({
  fromToken,
  toToken,
  fromAmount = "0",
  toAmount = "0",
  priceImpact = "0",
  minimumReceived = "0",
  fees = "0",
  routes = [],
}) => {
  console.log("OrderPreview Props:", {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    priceImpact,
    minimumReceived,
    fees,
    routes,
  });
  return (
    <div className="bg-[#1A1C24] rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white text-lg">
          1 {fromToken?.symbol} ≈ {(toAmount / fromAmount).toFixed(6)}{" "}
          {toToken?.symbol}
        </span>
        <div className="flex gap-2">
          {/* Copy Button */}
          <button
            className="text-[#7EBAFF]"
            onClick={() => {
              const rate = (toAmount / fromAmount).toFixed(6);
              navigator.clipboard.writeText(
                `1 ${fromToken?.symbol} = ${rate} ${toToken?.symbol}`
              );
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>

          <button className="text-[#7EBAFF]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M4 4v16h16" />
              <path d="M4 20l16-16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center gap-1">
            Minimum Received
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <span className="text-white">
            {minimumReceived?.toFixed(6)} {toToken?.symbol}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center gap-1">
            Price Impact
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <span
            className={`${
              parseFloat(priceImpact) > 1
                ? "text-yellow-400"
                : parseFloat(priceImpact) > 5
                ? "text-red-500"
                : "text-white"
            }`}
          >
            {priceImpact}%
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center gap-1">
            Route
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1 text-sm">
            {routes?.map((route, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1 text-gray-400">→</span>}
                <span className="text-white">{route.name}</span>
                <span className="text-gray-400 ml-1">({route.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center gap-1">
            Network Fee
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <span className="text-white">
            {typeof fees === "number" ? fees.toFixed(4) : fees}{" "}
            {fromToken?.symbol}
          </span>
        </div>
      </div>

      {Number(fromAmount) < 0.01 && (
        <div className="mt-4 text-pink-500 text-sm">
          You need at least 0.01 {fromToken?.symbol} to pay for fees and
          deposits
        </div>
      )}

      {parseFloat(priceImpact) > 5 && (
        <div className="mt-4 text-pink-500 text-sm">
          Warning: High price impact. You may want to reduce your trade size.
        </div>
      )}
    </div>
  );
};

export default OrderPreview;
