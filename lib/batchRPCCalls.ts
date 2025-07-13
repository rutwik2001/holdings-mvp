import getPrices from './getPrices';
import createContractInstances from '@/config/instances';
import { ethers } from 'ethers';

const ERC20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

const erc20Interface = new ethers.Interface(ERC20Abi);

export default async function getBatchedBalances(address: string) {
  const pricesInUSD = await getPrices();
  const { instances, ERC20Tokens, nativeTokens } = await createContractInstances();

  const balances: any[] = [];
  let value: number = 0;
  const callsByChain: Record<string, { target: string, callData: string }[]> = {
      'Ethereum Sepolia': [],
      'Optimism Sepolia': [],
      'ZetaChain Athens': [],
    };
    
    // Group ERC20 token calls
    for (const token of ERC20Tokens) {
      if (token.address) {
        const callData = erc20Interface.encodeFunctionData("balanceOf", [address]);
        callsByChain[token.blockchain].push({
          target: token.address,
          callData
        });
      }
    }

    for (const chain of Object.keys(callsByChain)) {
      const multicall = instances[chain];
      if (!multicall) continue;

      try {
        const [blockNumber, returnData, nativeBalance] = await multicall.aggregate(address, callsByChain[chain]);

        // Decode ERC20 balances
        returnData.forEach((ret: string, i: number) => {
          const token = ERC20Tokens.find(
            (t) => t.blockchain === chain && t.address === callsByChain[chain][i].target
          );
          if (token) {
            const balance = erc20Interface.decodeFunctionResult("balanceOf", ret)[0];
            const formattedBalance = ethers.formatUnits(balance, token.decimals);
            if(Number(balance) > 0){
              balances.push({
                symbol: token.symbol,
                name: token.name,
                contractAddress: token.address,
                balance: balance.toString(),
                formattedBalance: formattedBalance.toString(),
                value: Number(formattedBalance) * pricesInUSD[token.symbol.toLowerCase()].usd,
                walletAddress: address,
                blockchain: chain,
                decimals: token.decimals,
                })
              value += Number(formattedBalance) * pricesInUSD[token.symbol.toLowerCase()].usd
            }
            
          }
        });

        // Add native token balance
        const formattedNativeBalance = ethers.formatUnits(nativeBalance, nativeTokens[chain].decimals);
        if(Number(nativeBalance) > 0){
          balances.push({
                symbol: nativeTokens[chain].symbol,
                name: nativeTokens[chain].name,
                contractAddress: null,
                balance: nativeBalance.toString(),
                formattedBalance: formattedNativeBalance.toString(),
                value: Number(formattedNativeBalance) * pricesInUSD[nativeTokens[chain].symbol.toLowerCase()].usd,
                walletAddress: address,
                blockchain: chain,
                decimals: nativeTokens[chain].decimals,
                })
        value += Number(formattedNativeBalance) * pricesInUSD[nativeTokens[chain].symbol.toLowerCase()].usd
        }
      } catch (err) {
        console.error(`Multicall failed for ${chain} and address ${address}:`, err);
      }
    }
  return {balances, value};
}
