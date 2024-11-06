import { useState, useEffect, useRef, useCallback } from "react";
import { TokenListProvider } from "@solana/spl-token-registry";
const popularTokens = [
  {
    symbol: "USDC",
    name: "USD Coin",
    logoURI: "/usdc-logo.png",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    symbol: "SOL",
    name: "Solana",
    logoURI: "/solana-logo.png",
    address: "So11111111111111111111111111111111111111112",
  },
  {
    symbol: "RAY",
    name: "Raydium",
    logoURI: "/ray-logo.png",
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  },
  {
    symbol: "USDT",
    name: "USDT",
    logoURI: "/usdt-logo.png",
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
];
const TokenSelectModal = ({ isOpen, onClose, onSelect }) => {
  const [tokens, setTokens] = useState([]);
  const [displayedTokens, setDisplayedTokens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef();
  const TOKENS_PER_PAGE = 20;

  const lastTokenElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true);
      const tokenList = await new TokenListProvider().resolve();
      const mainnetTokens = tokenList
        .filterByClusterSlug("mainnet-beta")
        .getList();
      setTokens(mainnetTokens);
      setDisplayedTokens(mainnetTokens.slice(0, TOKENS_PER_PAGE));
      setLoading(false);
    };

    if (isOpen) {
      loadTokens();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!tokens.length) return;

    const filtered = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setDisplayedTokens(filtered.slice(0, page * TOKENS_PER_PAGE));
  }, [page, searchQuery, tokens]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#1A1C24] rounded-2xl w-full max-w-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">Select a token</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
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

          {/* Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by token or paste address"
              className="w-full bg-[#2C2F36] text-gray-200 rounded-xl px-4 py-3 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {displayedTokens.map((token, index) => (
              <div
                key={token.address}
                ref={
                  index === displayedTokens.length - 1
                    ? lastTokenElementRef
                    : null
                }
                className="flex items-center justify-between p-3 hover:bg-[#2C2F36] rounded-xl cursor-pointer"
                onClick={() => onSelect(token)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-white">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default TokenSelectModal;
