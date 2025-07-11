import clientPromise from '@/config/mongodb';

export default async function getPrices(){

    const client = await clientPromise;
    const db = client.db('Holdings');
    const cacheCollection = db.collection('pricesCache');

    const latestCache = await cacheCollection
        .find({})
        .sort({ updatedAt: -1 })   // sort newest first
        .limit(1)
        .next();

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000; // refresh proces once a day

    if (latestCache && (now - latestCache.updatedAt < oneDayMs)) {
        // Fresh enough, return cached prices
        console.log('Using cached prices');
        return latestCache.prices;
    }

    
    try {
        const pricesResp = await fetch(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&symbols=btc%2Ceth%2Czeta%2C%20usdc`, {
         method: 'GET',
         headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.coingeckoAPI!}
        });
        const prices = await pricesResp.json();
        console.log(prices)
        await cacheCollection.insertOne({
            prices,
            updatedAt: new Date()
        });
        
        return prices
    } catch (error: any) {
        console.error('Fetch error:', error.message);

        if (latestCache) {
        // Fallback to stale cache
        return latestCache.prices;
        }
    }
    
}




