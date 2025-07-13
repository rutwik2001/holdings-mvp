'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  walletAddress: string | null;
  isConnecting: boolean;
  setIsConnecting: (val: boolean) => void;
  onConnected: (address: string, provider: ethers.BrowserProvider) => void;
}

export default function WalletConnect({
  walletAddress,
  isConnecting,
  setIsConnecting,
  onConnected,
}: WalletConnectProps) {
  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      onConnected(address, provider);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      {walletAddress ? (
        <div className="w-full md:w-[170px] h-[44px] text-[#000000] text-sm px-[16px] py-[6px] rounded-[2px] border border-[#E5E8EC] flex items-center justify-center">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-5)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full md:w-auto h-[44px] bg-[#007457] text-white px-4 py-2 hover:bg-[#005F49] transition"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
