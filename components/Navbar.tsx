'use client';

import WalletConnect from './Wallet';

interface NavbarProps {
  onConnected: (address: string) => void;
}

export default function Navbar({ onConnected }: NavbarProps) {
  return (
   <header className="w-full h-[84px] bg-white flex justify-between items-center px-[72px] opacity-100">
      <h1 className="text-3xl font-bold text-[#005741] font-roobert flex items-center">
      Work<span className="text-[#00A5C6]">Trail</span>
      <span className="ml-2 bg-[#B0FF61] text-xs font-normal rounded-full px-[6px] py-[2px] flex items-center justify-center h-[17.33px]">
        Beta
      </span>
    </h1>
      <WalletConnect onConnected={onConnected} />
    </header>
  );
}
