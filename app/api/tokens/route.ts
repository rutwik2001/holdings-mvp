// app/api/tokens/route.ts

import clientPromise from '../../../config/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('Holdings');

    const tokens = await db.collection('tokens').find({}).toArray();

    return NextResponse.json(tokens);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
