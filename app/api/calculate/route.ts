import clientPromise from '../../../config/mongodb';
import {zetaChainProvider, ethSepoliaProvider, opSepoliaProvider} from '../../../config/rpcURLs';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import contractABI from '@/config/contractABI';
import getPrices from '@/lib/getPrices';
import createContractInstances from "@/config/instances";


export async function POST(request: any) {
  const { address } = await request.json();
  console.log(address);

  if(!address){
    return NextResponse.json({ error: 'Wallet address is not provided' }, { status: 500 });
  }
  try {
    
    const client = await clientPromise;
    const db = client.db('Holdings');
    const walletsCollection = db.collection('wallets')
    const results = await createContractInstances()
    const pricesInUSD = await getPrices()
    let value = 0
    const balances = await Promise.all(
      results.map(async (item) => {
        let balance: any = 0;
        let formattedBalance: string = "0";
        const provider =
            item.blockchain === "sepolia"
              ? ethSepoliaProvider
              : item.blockchain === "zetachain"
              ? zetaChainProvider
              : item.blockchain === "opSepolia"
              ? opSepoliaProvider
              : null;
        if (item.address == null) {
          if (provider){
            balance = (await provider.getBalance(address)).toString();
            formattedBalance = ethers.formatEther(balance);
          }
        } else {
          if (provider) {
            balance = (await item.contract.balanceOf(address)).toString();
            formattedBalance = ethers.formatUnits(balance, item.decimals);
          }
        }
        
        const usdValue =
          pricesInUSD[item.symbol.toLowerCase()].usd !== undefined
            ? Number(formattedBalance) * pricesInUSD[item.symbol.toLowerCase()].usd
            : 0;
        value += usdValue
        return {
          balance,
          formattedBalance,
          value: usdValue,
          walletAddress: address,
          symbol: item.symbol,
          name: item.name,
          contractAddress: item.contractAddress,
          blockchain: item.blockchain,
          decimals: item.decimals,
        };
      })
    );
    
    
    balances.sort((a, b) => b.value - a.value);
    console.log(balances)
    await walletsCollection.insertOne(
        { address: address, value: value, balances: balances, timestamp: Date.now() },
        
    );

    return NextResponse.json(balances, { status: 200 });
    
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
