import clientPromise from '../../../config/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import getBatchedBalances from '@/lib/batchRPCCalls';
import { Collection, Db } from 'mongodb';

// ----- Interfaces -----
// Represents token balance details for a wallet
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

// Represents a stored balance snapshot document
interface BalanceDoc {
  address: string;
  value: number;
  balances: BalanceResult[];
  timestamp: number;
}

// Represents a wallet document
interface Wallet {
  address: string;
}

// Represents comparison data to track portfolio value change
interface CompareResult {
  value: number;
  timestamp: number;
}

// POST handler for /api/calculate
export async function POST(request: NextRequest) {
  const body = await request.json();
  const address: string | undefined = body?.address;

   // Check if address is provided
  if (!address) {
    return NextResponse.json({ error: 'Wallet address is not provided' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db: Db = client.db('Holdings');
    const walletsCollection: Collection<Wallet> = db.collection<Wallet>('wallets');
    const balancesCollection: Collection<BalanceDoc> = db.collection<BalanceDoc>('balances');

    // Fetch the most recent portfolio snapshot for this wallet
    const lastCheckPoint: BalanceDoc | null = await balancesCollection.findOne(
      { address },
      { sort: { timestamp: -1 } }
    );

    // Fetch current balances and portfolio value
    const {
      balances,
      value,
    }: { balances: BalanceResult[]; value: number } = await getBatchedBalances(address);

    // Insert new snapshot if balances are found
    if (balances.length > 0) {
      balances.sort((a, b) => b.value - a.value);
      await balancesCollection.insertOne({
        address,
        value,
        balances: balances,
        timestamp: Date.now(),
      });
    }

    // If there was a previous snapshot, return the difference
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
      // If it's the first time tracking this wallet, insert it
      await walletsCollection.updateOne(
        { address },
        { $setOnInsert: { address } },
        { upsert: true }
      );
    }

    // Return response with no previous comparison data
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
