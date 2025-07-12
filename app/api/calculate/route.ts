import clientPromise from '../../../config/mongodb';
import {zetaChainProvider, ethSepoliaProvider, opSepoliaProvider} from '../../../config/rpcURLs';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import getPrices from '@/lib/getPrices';
import createContractInstances from "@/config/instances";
import getBatchedBalances from "@/lib/batchRPCCalls"


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

    const { balances, value } = await getBatchedBalances(address);

    
    balances.sort((a, b) => b.value - a.value);
    await walletsCollection.insertOne(
        { address: address, value: value, balances: balances, timestamp: Date.now() },
        
    );
    if(lastCheckPoint){
      const changeInValue = value - lastCheckPoint.value
      return NextResponse.json({balances, value, comparedResult: {value: changeInValue, timestamp: lastCheckPoint.timestamp}}, { status: 200 });
    }
    return NextResponse.json({balances, value, comparedResult: null}, { status: 200 });
    
    
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
