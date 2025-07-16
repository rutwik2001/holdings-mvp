'use client';

import WalletConnect from './Wallet';
import { ethers } from 'ethers';

interface NavbarProps {
  onConnected: (address: string, provider: ethers.BrowserProvider) => void;
  walletAddress: string | null;
  isConnecting: boolean;
  setIsConnecting: (val: boolean) => void;
}

export default function Navbar({ onConnected, walletAddress, isConnecting, setIsConnecting }: NavbarProps) {
  return (
    <>
      <header className="w-full h-[84px] bg-white flex justify-between items-center px-[24px] md:px-[72px] opacity-100">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <h1 className="text-2xl md:text-3xl font-bold text-[#005741] font-roobert flex items-center">
          Work<span className="text-[#00A5C6]">Trial</span>
          <span className="ml-2 bg-[#B0FF61] text-xs font-normal rounded-full px-[6px] py-[2px] flex items-center justify-center h-[17.33px]">
            Beta
          </span>
        </h1>

        {/* Desktop */}
        <div className="hidden md:block">
          <WalletConnect
            onConnected={onConnected}
            walletAddress={walletAddress}
            isConnecting={isConnecting}
            setIsConnecting={setIsConnecting}
          />
        </div>

        {/* Mobile */}
        <div className="bottom-0 left-0 w-full fixed bg-white border-t border-[#E5E8EC] md:hidden z-999">
          <WalletConnect
            onConnected={onConnected}
            walletAddress={walletAddress}
            isConnecting={isConnecting}
            setIsConnecting={setIsConnecting}
          />
        </div>
      </header>
    </>
  );
}

