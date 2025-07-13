import clientPromise from '../../../config/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import getBatchedBalances from '@/lib/batchRPCCalls';
import { Collection, Db } from 'mongodb';

// ----- Interfaces -----
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

interface BalanceDoc {
  address: string;
  value: number;
  balances: BalanceResult[];
  timestamp: number;
}

interface Wallet {
  address: string;
}

interface CompareResult {
  value: number;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const address: string | undefined = body?.address;

  if (!address) {
    return NextResponse.json({ error: 'Wallet address is not provided' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db: Db = client.db('Holdings');
    const walletsCollection: Collection<Wallet> = db.collection<Wallet>('wallets');
    const balancesCollection: Collection<BalanceDoc> = db.collection<BalanceDoc>('balances');

    const lastCheckPoint: BalanceDoc | null = await balancesCollection.findOne(
      { address },
      { sort: { timestamp: -1 } }
    );

    const {
      balances,
      value,
    }: { balances: BalanceResult[]; value: number } = await getBatchedBalances(address);


    if (balances.length > 0) {
      balances.sort((a, b) => b.value - a.value);
      await balancesCollection.insertOne({
        address,
        value,
        balances: balances,
        timestamp: Date.now(),
      });
    }

    if (lastCheckPoint) {
      const changeInValue: number = value - lastCheckPoint.value;
      const comparedResult: CompareResult = {
        value: changeInValue,
        timestamp: lastCheckPoint.timestamp,
      };

      return NextResponse.json(
        { balances: balances, value, comparedResult },
        { status: 200 }
      );
    } else {
      // Add wallet if not already in collection
      await walletsCollection.updateOne(
        { address },
        { $setOnInsert: { address } },
        { upsert: true }
      );
    }

    return NextResponse.json(
      { balances: balances, value, comparedResult: null },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error in POST /balance route');
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
