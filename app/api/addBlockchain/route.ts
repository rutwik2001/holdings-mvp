import clientPromise from '../../../config/mongodb';
import { NextResponse } from 'next/server';



export async function POST(request: any) {
  const { rpcURL, name, symbol, decimals, blockchain } = await request.json();
  

  if(!rpcURL || !name || !symbol || !decimals){
    return NextResponse.json({ error: 'Required data is missing' }, { status: 500 });
  }
  try {
    const client = await clientPromise;
    const db = client.db('Holdings');
    const tokensCollection = db.collection('tokens')
    
    console.log(rpcURL)
    
    await tokensCollection.insertOne(
        { name, symbol, decimals, blockchain, address: null },
        
    );

    return NextResponse.json({success: true}, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
