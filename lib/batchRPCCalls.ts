import { ethers } from 'ethers';
import getPrices from '@/lib/getPrices';
import createContractInstances from "@/config/instances";
import { ethSepoliaProvider, opSepoliaProvider, zetaChainProvider } from "@/config/rpcURLs";

const providerMap: any = {
  "Ethereum Sepolia": ethSepoliaProvider,
  "Optimism Sepolia": opSepoliaProvider,
  "ZetaChain Athens": zetaChainProvider,
};

export default async function getBatchedBalances(address: string) {
  const pricesInUSD = await getPrices();
  const results = await createContractInstances(); // your cached tokens

  const groupedByChain: any = {
    "Ethereum Sepolia": [],
    "Optimism Sepolia": [],
    "ZetaChain Athens": [],
  };

  for (const item of results) {
    groupedByChain[item.blockchain].push(item);
  }

  let totalValue = 0;
  const allBalances: any[] = [];

  for (const chain in groupedByChain) {
    const provider = providerMap[chain];
    const tokens = groupedByChain[chain];

    const calls: Promise<any>[] = [];

    // Native token call (only once per chain)
    calls.push(provider.getBalance(address));

    // ERC-20 balanceOf() calls
    for (const token of tokens) {
      if (token.instance) {
        calls.push(token.instance.balanceOf(address));
      }
    }

    const results = await Promise.all(calls);

    // First result is native token
    const nativeBalance = results[0];
    const nativeFormatted = ethers.formatEther(nativeBalance);
    const nativeUSD =
      (pricesInUSD["eth"]?.usd ?? 0) * Number(nativeFormatted);

    totalValue += nativeUSD;
    allBalances.push({
      symbol: "ETH",
      name: "Ethereum",
      contractAddress: null,
      balance: nativeBalance.toString(),
      formattedBalance: nativeFormatted,
      value: nativeUSD,
      walletAddress: address,
      blockchain: chain,
      decimals: 18,
    });

    // Then ERC-20 tokens
    for (let i = 1; i < results.length; i++) {
      const token = tokens[i - 1];
      const raw = results[i];
      const formatted = ethers.formatUnits(raw, token.decimals);
      const usdValue =
        Number(formatted) * (pricesInUSD[token.symbol.toLowerCase()]?.usd ?? 0);

      totalValue += usdValue;
      allBalances.push({
        symbol: token.symbol,
        name: token.name,
        contractAddress: token.contractAddress,
        balance: raw.toString(),
        formattedBalance: formatted,
        value: usdValue,
        walletAddress: address,
        blockchain: chain,
        decimals: token.decimals,
      });
    }
  }

  // Sort by USD value descending
  allBalances.sort((a, b) => b.value - a.value);

  return { balances: allBalances, value: totalValue };
}
