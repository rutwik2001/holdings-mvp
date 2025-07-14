'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HoldingsSection from '@/components/Holdings';
import TokensSection from '@/components/TokensSection';

interface BalanceResult {
  symbol: string;
  name: string;
  contractAddress: string | null;
  balance: string;
  formattedBalance: string;
  value: number;
  walletAddress: string;
  blockchain: string;
  decimals: number;
}

// Token interface defining token properties
interface Token {
  symbol: string;
  name: string;
  network: string;
  amount: number;
  formattedBalance: number;
  valueUSD: number;
}

// Interface to hold the comparison of portfolio value changes
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

  /**
   * Handler called when wallet is connected.
   * Fetches balances and portfolio data from the backend API.
   * @param address - Connected wallet address
   * @param provider - ethers.js BrowserProvider instance
   */
  const handleConnected = async (address: string) => {
    setWalletAddress(address);
    setLoading(true);

    try {
      // Call backend API to get token balances and portfolio value
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      // Map received balances into Token objects
      const tokenList: Token[] = data.balances.map((t: BalanceResult): Token => ({
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
      {/* Navbar with wallet connect controls */}
      <Navbar
        onConnected={handleConnected}
        walletAddress={walletAddress}
        isConnecting={isConnecting}
        setIsConnecting={setIsConnecting}
      />
      {/* Main content container */}
      <div className="md:w-full flex justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start md:items-center w-full">
          {/* Display holdings summary */}
          <HoldingsSection
            loading={loading}
            walletAddress={walletAddress}
            portfolioValue={portfolioValue}
            comparedResult={comparedResult}
          />

          {/* Display detailed tokens list */}
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
