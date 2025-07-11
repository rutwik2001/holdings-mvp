'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function WalletConnect({
  onConnected,
}: {
  onConnected: (address: string, provider: ethers.BrowserProvider) => void;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      setIsConnecting(true);

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      onConnected(address, provider);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {walletAddress ? (
        <div className="w-[170px] h-[36px] text-[#000000] text-sm px-[16px] py-[6px] rounded-[2px] border border-[#E5E8EC] flex items-center justify-center">
    {walletAddress.slice(0, 6)}...{walletAddress.slice(-5)}
  </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-[#007457] text-white px-4 py-2 rounded hover:bg-[#007457]"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
