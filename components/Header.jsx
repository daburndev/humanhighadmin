import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="relative bg-gradient-to-b from-gray-900 to-gray-900/80 border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Logo and Title */}
        <Link href="/">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <Image
                src="/images/logo.png"
                alt="Human High Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                For Human High
              </h1>
              <p className="text-xs text-gray-400">
                Premium Cannabis Collection
              </p>
            </div>
          </div>
        </Link>
        {/* Filter Pills */}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10"></div>
    </header>
  );
};

export default Header;
