import clientPromise from '../../../config/mongodb';
import {zetaChainProvider, ethSepoliaProvider, opSepoliaProvider} from '../../../config/rpcURLs';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import getPrices from '@/lib/getPrices';
import createContractInstances from "@/config/instances";


export async function POST(request: any) {
  const { address } = await request.json();
  console.log(address);

  if(!address){
    return NextResponse.json({ error: 'Wallet address is not provided' }, { status: 400 });
  }
  try {
    
    const client = await clientPromise;
    const db = client.db('Holdings');
    const walletsCollection = db.collection('wallets')

    const lastCheckPoint = await walletsCollection.findOne(
      { address: address },
      { sort: { timestamp: -1 } }
    );

    const results = await createContractInstances()
    const pricesInUSD = await getPrices()
    let value = 0
    const balances = await Promise.all(
      results.map(async (item) => {
        let balance: any = 0;
        let formattedBalance: string = "0";
        const provider =
            item.blockchain === "Ethereum Sepolia"
              ? ethSepoliaProvider
              : item.blockchain === "ZetaChain Athens"
              ? zetaChainProvider
              : item.blockchain === "Optimism Sepolia"
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
    await walletsCollection.insertOne(
        { address: address, value: value, balances: balances, timestamp: Date.now() },
        
    );
    if(lastCheckPoint){
      const changeInValue = value - lastCheckPoint.value
      console.log(changeInValue)
      return NextResponse.json({balances, value, comparedResult: {value: changeInValue, timestamp: lastCheckPoint.timestamp}}, { status: 200 });
    }
    return NextResponse.json({balances, value, comparedResult: null}, { status: 200 });
    
    
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
