import React from "react";

const Footer = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 border-t border-white/10 backdrop-blur-md">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 pointer-events-none"></div>

        {/* Content Container */}
        <div className="container mx-auto px-3 py-2 relative z-10">
          <div className="flex items-center justify-between gap-2">
            {/* Left Side - Promotion Text */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xl">🎁</span>
              <div className="flex flex-wrap items-center gap-x-1.5 text-sm">
                <span className="text-white/80">Buy</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  5G
                </span>
                <span className="text-white/80">Get</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                  2G FREE
                </span>
              </div>
            </div>

            {/* Right Side - CTA */}
            <a
              href="https://t.me/+XVdOvrRz3e8zNjM9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all group relative"
            >
              <span className="text-white font-medium text-xs sm:text-sm">
                Order
              </span>
              <svg
                className="w-3 h-3 text-white transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="h-[44px]"></div>;
    </>
  );
};

export default Footer;
