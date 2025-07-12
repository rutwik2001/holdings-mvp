'use client';


import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoTokens from '@/components/NoTokens';
import Image from 'next/image';
import HoldingsSection from '@/components/Holdings';
import TokensSection from '@/components/TokensSection';
import { ethers } from 'ethers';
import { useState } from 'react';


interface Token {
  symbol: string;
  name: string;
  network: string;
  amount: number;
  formattedBalance: number,
  valueUSD: number;
}





export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [comparedResult, setComparedResult] = useState<{
  value: number;
  timestamp: number;
} | null>(null);


  const handleConnected = async (address: string, provider: ethers.BrowserProvider) => {
    setWalletAddress(address);
    setLoading(true);
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    const data = await res.json();

    const tokenList: Token[] = data.balances.map((t: any) => ({
      symbol: t.symbol,
      name: t.name,
      network: t.blockchain,
      amount: Number(t.balance),
      formattedBalance: Number(t.formattedBalance),
      valueUSD: Number(t.value),
    }));
    setTokens(tokenList);
    setPortfolioValue(data.value);
    setComparedResult(data.comparedResult); 
    setLoading(false);
  };

  function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-300 rounded ${className} animate-pulse`} />
  );
}


  return (
    

    <main className="bg-[#FFFFFF] min-h-screen font-roobert font-medium">
  <Navbar
  onConnected={handleConnected}
  walletAddress={walletAddress}
  isConnecting={isConnecting}
  setIsConnecting={setIsConnecting}
/>

  <div className="md:w-full flex justify-center px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-start md:items-center w-full">
      <HoldingsSection
        loading={loading}
        walletAddress={walletAddress}
        portfolioValue={portfolioValue}
        comparedResult={comparedResult}
      />

      <div className="flex flex-col items-start mt-[56px] md:items-center w-full">
        <TokensSection
          loading={loading}
          walletAddress={walletAddress}
          tokens={tokens}
        />
      </div>
    </div>
  </div>

  <Footer />
</main>

  );
}
