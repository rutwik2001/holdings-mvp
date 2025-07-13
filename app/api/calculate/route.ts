import clientPromise from '../../../config/mongodb';
import { NextResponse } from 'next/server';
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
    const balancesCollection = db.collection('balances')


    const lastCheckPoint = await balancesCollection.findOne(
      { address: address },
      { sort: { timestamp: -1 } }
    );

    const { balances, value } = await getBatchedBalances(address);

    if(balances.length > 0){
      balances.sort((a, b) => b.value - a.value);
      await balancesCollection.insertOne(
          { address: address, value: value, balances: balances, timestamp: Date.now() },
          
      );
    }
    
    if(lastCheckPoint){
      const changeInValue = value - lastCheckPoint.value
      return NextResponse.json({balances, value, comparedResult: {value: changeInValue, timestamp: lastCheckPoint.timestamp}}, { status: 200 });
    } else{
      await walletsCollection.insertOne(
        { address: address },
    );
    }
    return NextResponse.json({balances, value, comparedResult: null}, { status: 200 });
    
    
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
