'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HoldingsSection from '@/components/Holdings';
import TokensSection from '@/components/TokensSection';

interface Token {
  symbol: string;
  name: string;
  network: string;
  amount: number;
  formattedBalance: number;
  valueUSD: number;
}

interface ComparedResult {
  value: number;
  timestamp: number;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [comparedResult, setComparedResult] = useState<ComparedResult | null>(null);

  const handleConnected = async (address: string, provider: ethers.BrowserProvider) => {
    setWalletAddress(address);
    setLoading(true);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      const tokenList: Token[] = data.balances.map((t: any): Token => ({
        symbol: t.symbol,
        name: t.name,
        network: t.blockchain,
        amount: Number(t.balance),
        formattedBalance: Number(t.formattedBalance),
        valueUSD: Number(t.value),
      }));

      setTokens(tokenList);
      setPortfolioValue(data.value);
      setComparedResult(data.comparedResult ?? null);
    } catch (err) {
      console.error('Error fetching balances:', err);
    } finally {
      setLoading(false);
    }
  };

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
