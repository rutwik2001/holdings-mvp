'use client';


import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoTokens from '@/components/NoTokens';
import Image from 'next/image';
import HoldingsSection from '@/components/Holdings';
import TokensSection from '@/components/TokensSection';

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

  const handleConnected = async (address: string) => {
    setWalletAddress(address);
    setLoading(true)
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    const data = await res.json();
    console.log(data)
    // Example transform from your API response into tokens and portfolioValue
    const tokenList: Token[] = data.map((t: any) => ({
      symbol: t.symbol,
      name: t.name,
      network: t.blockchain,
      amount: Number(t.balance),
      formattedBalance: Number(t.formattedBalance),      // adapt field names as needed
      valueUSD: Number(t.value),   // total token value in USD
    }));
    setTokens(tokenList);
    setPortfolioValue(tokenList.reduce((acc, t) => acc + t.valueUSD, 0));
    setLoading(false)
  };

  function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-300 rounded ${className} animate-pulse`} />
  );
}


  return (
    

    <main className="bg-[#FFFFFF] min-h-screen font-roobert font-medium">
      <Navbar onConnected={handleConnected} />
      
      
        <div className="w-full flex justify-center">
          <HoldingsSection
            loading={loading}
            walletAddress={walletAddress}
            portfolioValue={portfolioValue}
          />
        </div>
          <div className="w-full flex justify-center mt-[56px]">
             <TokensSection
                loading={loading}
                walletAddress={walletAddress}
                tokens={tokens}
              />
          </div>
        
      
    

    <Footer/>
      
    </main>
  );
}
