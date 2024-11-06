// src/components/Footer.jsx
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1C24] py-8 mt-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Brand and Copyright */}
          <div className="text-center">
            <div className="text-2xl font-bold text-[#7EBAFF] mb-2">
              SolSwap
            </div>
            <p className="text-gray-400">
              © {currentYear} SolSwap. All rights reserved
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/kamrancodex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#7EBAFF] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="https://twitter.com/kamran11011"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#7EBAFF] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span>Made with</span>
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>by</span>

            <a
              href="https://twitter.com/kamran11011"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7EBAFF] hover:underline font-medium"
            >
              Kamran
            </a>
          </div>

          <div className="text-center text-gray-400 text-sm mt-4">
            <p>Thank you for using SolSwap</p>
            <p className="mt-1">Your trusted DEX aggregator on Solana</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
