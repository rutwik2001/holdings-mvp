'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Props definition for the WalletConnect component
interface WalletConnectProps {
  walletAddress: string | null;
  isConnecting: boolean;
  setIsConnecting: (val: boolean) => void;
  onConnected: (address: string, provider: ethers.BrowserProvider) => void;
}

 /**
   * Triggered when the user clicks “Connect Wallet”.
   * Handles MetaMask connection flow and returns the address/provider
   * via the onConnected callback.
   */
export default function WalletConnect({
  walletAddress,
  isConnecting,
  setIsConnecting,
  onConnected,
}: WalletConnectProps) {
  // Grab the injected `window.ethereum` object (MetaMask or compatible)
  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      // Prompt the user if MetaMask is not installed
      alert('Please install MetaMask');
      return;
    }

    try {
      setIsConnecting(true);
      // Initialize an ethers BrowserProvider with the injected provider
      const provider = new ethers.BrowserProvider(ethereum);
      // Request wallet connection (prompts MetaMask)
      await provider.send('eth_requestAccounts', []);
      // Retrieve the connected address
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      // Pass back the connected address and provider to parent component
      onConnected(address, provider);
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      {/* If wallet is already connected, show the truncated address badge */}
      {walletAddress ? (
        <div className="w-full md:w-[170px] h-[44px] text-[#000000] text-sm px-[16px] py-[6px] rounded-[2px] border border-[#E5E8EC] flex items-center justify-center">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-5)}
        </div>
      ) : (
        /* Otherwise, show the connect button */
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
