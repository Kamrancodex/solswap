const FAQ = () => {
  const faqs = [
    {
      question: "What is slippage and why is it important?",
      answer:
        "Slippage is the difference between the expected price of a trade and the actual executed price. It occurs due to market volatility and is important because it protects you from unfavorable price movements. For example, if you set 0.5% slippage, your trade will only execute if the price doesn't move unfavorably by more than 0.5%.",
    },
    {
      question: "Why do some transactions fail?",
      answer:
        "Transactions can fail for several reasons: insufficient funds to cover the swap and network fees, high price impact, expired quotes due to market movements, or network congestion. We recommend ensuring you have enough SOL for fees and setting an appropriate slippage tolerance.",
    },
    {
      question: "What makes our swap service unique?",
      answer:
        "Our service aggregates liquidity from multiple DEXs to find you the best prices, charges zero platform fees, and uses Jupiter's advanced routing to optimize your trades. We prioritize user experience and transparency while ensuring you get the best possible rates.",
    },
    {
      question: "What is 'Price Impact'?",
      answer:
        "Price impact shows how much your trade will affect the token's price in the pool. Large trades typically have higher price impact. We recommend keeping price impact under 1% by either trading smaller amounts or finding pools with more liquidity.",
    },
    {
      question: "How is the exchange rate calculated?",
      answer:
        "Exchange rates are determined by the liquidity pools' current state and use automated market maker (AMM) formulas. The rate you see includes the optimal routing through multiple DEXs to get you the best possible price.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden fees! You only pay the network's transaction fees (in SOL) and the standard DEX fees that go to liquidity providers. We don't charge any additional platform or service fees.",
    },
    {
      question: "What is 'Minimum Received'?",
      answer:
        "Minimum Received is the least amount of tokens you're guaranteed to get from your swap, calculated using your slippage tolerance. If the trade would result in receiving less than this amount, the transaction will fail to protect you.",
    },
    {
      question: "Why do I need SOL for fees?",
      answer:
        "SOL is needed to pay for transaction fees on the Solana network. These fees are very small (typically < 0.00001 SOL) but necessary for any transaction. Make sure to keep some SOL in your wallet for these fees.",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400">
          Everything you need to know about our swap service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#1A1C24] rounded-xl p-6 hover:bg-[#2C2F36] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#7EBAFF]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#7EBAFF] font-medium">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="mt-12 bg-[#1A1C24] rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://docs.jup.ag/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 bg-[#2C2F36] rounded-lg hover:bg-[#363A45] transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#7EBAFF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-white">Documentation</span>
          </a>

          <a
            href="https://jupiter.ag/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 bg-[#2C2F36] rounded-lg hover:bg-[#363A45] transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#7EBAFF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-white">Jupiter Protocol</span>
          </a>

          <a
            href="https://solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 bg-[#2C2F36] rounded-lg hover:bg-[#363A45] transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#7EBAFF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <span className="text-white">Solana Network</span>
          </a>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Still have questions?{" "}
          <a
            href="mailto:najarkamran212@gmail.com"
            className="text-[#7EBAFF] hover:underline"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQ;
