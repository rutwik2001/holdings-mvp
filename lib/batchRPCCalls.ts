import getPrices from './getPrices';
import createContractInstances from '@/config/instances';
import { ethers, Interface, Contract } from 'ethers';

const ERC20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

// Represents a token object from the database
interface Token {
  symbol: string;
  name: string;
  address: string | null;
  blockchain: string;
  decimals: number;
}

// Represents the structure of a token balance for a wallet
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

const erc20Interface: Interface = new ethers.Interface(ERC20Abi);

/**
 * Retrieves token balances and USD values for a list of wallet addresses.
 * Uses multicall contracts per chain to batch balanceOf calls for ERC-20 tokens
 * and native token balances.
 *
 * @param address - An address from frontend -> api -> this function.
 * @returns balances - Token balance data of different tokens
 *          value - Total portfolio USD value 
 */
export default async function getBatchedBalances(
  address: string
): Promise<{ balances: BalanceResult[]; value: number }> {
  const pricesInUSD: Record<string, { usd: number }> = await getPrices();

   // Get deployed contract instances, token metadata, and native token definitions
  const {
    instances,
    ERC20Tokens,
    nativeTokens,
  }: {
    instances: Record<string, Contract>;
    ERC20Tokens: Token[];
    nativeTokens: Record<string, Token>;
  } = await createContractInstances();

  const balances: BalanceResult[] = [];
  let value: number = 0;

  const callsByChain: Record<string, { target: string; callData: string }[]> = {
    'Ethereum Sepolia': [],
    'Optimism Sepolia': [],
    'ZetaChain Athens': [],
  };

  // Group ERC20 token calls by chain and prepare batched calls for all (address, token) pairs
  for (const token of ERC20Tokens) {
    if (token.address) {
      const callData: string = erc20Interface.encodeFunctionData('balanceOf', [address]);
      callsByChain[token.blockchain].push({
        target: token.address,
        callData,
      });
    }
  }

  for (const chain of Object.keys(callsByChain)) {
    const multicall: Contract | undefined = instances[chain];
    if (!multicall) continue;

    try {
      // Execute batched ERC-20 balanceOf calls using multicall and also the native baalnce in one function
      const [blockNumber, returnData, nativeBalance]: [bigint, string[], bigint] = await multicall.aggregate(
        address,
        callsByChain[chain]
      );

      // Decode ERC20 balances, Only adds non-zero balances
      returnData.forEach((ret: string, i: number) => {
        const token = ERC20Tokens.find(
          (t) => t.blockchain === chain && t.address === callsByChain[chain][i].target
        );
        if (token) {
          const balance = erc20Interface.decodeFunctionResult('balanceOf', ret)[0] as bigint;
          const formattedBalance: string = ethers.formatUnits(balance, token.decimals);
          const numericBalance = Number(balance);

          if (numericBalance > 0) {
            const tokenValue = Number(formattedBalance) * pricesInUSD[token.symbol.toLowerCase()].usd;
            balances.push({
              symbol: token.symbol,
              name: token.name,
              contractAddress: token.address,
              balance: balance.toString(),
              formattedBalance: formattedBalance.toString(),
              value: tokenValue,
              walletAddress: address,
              blockchain: chain,
              decimals: token.decimals,
            });
            value += tokenValue;
          }
        }
      });

      // Add native token balance, Only adds non-zero balances
      const native = nativeTokens[chain];
      const formattedNativeBalance: string = ethers.formatUnits(nativeBalance, native.decimals);
      const numericNativeBalance = Number(nativeBalance);

      if (numericNativeBalance > 0) {
        const nativeValue = Number(formattedNativeBalance) * pricesInUSD[native.symbol.toLowerCase()].usd;
        balances.push({
          symbol: native.symbol,
          name: native.name,
          contractAddress: null,
          balance: nativeBalance.toString(),
          formattedBalance: formattedNativeBalance.toString(),
          value: nativeValue,
          walletAddress: address,
          blockchain: chain,
          decimals: native.decimals,
        });
        value += nativeValue;
      }
    } catch (err) {
      console.error(`Multicall failed for ${chain} and address ${address}:`, err);
    }
  }

  return { balances, value };
}
