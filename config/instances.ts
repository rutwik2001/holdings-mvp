
import clientPromise from './mongodb';
import {zetaChainProvider, ethSepoliaProvider, opSepoliaProvider} from './rpcURLs';
import { ethers } from 'ethers';
import { MulticallProvider } from "@ethers-ext/provider-multicall";
import contractABI from '@/config/contractABI';

let cachedInstances: any[] | null = null;
let cachedTokenCount = 0;

export default async function createContractInstances(){
    const client = await clientPromise;
    const db = client.db('Holdings');
    const tokensCollection = db.collection('tokens');

    const currentCount = await tokensCollection.countDocuments();

    if (cachedInstances && cachedTokenCount === currentCount) {
        // Cache is valid
        return cachedInstances;
    }


    
    const results = await tokensCollection.find({}).toArray();
    
    
    // const multicaller = new MulticallProvider(ethSepoliaProvider);
    // const USDCethSepolia = new ethers.Contract("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", contractABI, multicaller);
    // const balances = await Promise.all([
    //   USDCethSepolia.balanceOf(address)
    // ]);
    // console.log(balances)
    const instances = await Promise.all(
          results.map(async (item) => {
            let contract: any;
           
            const provider =
                item.blockchain === "sepolia"
                  ? ethSepoliaProvider
                  : item.blockchain === "zetachain"
                  ? zetaChainProvider
                  : item.blockchain === "opSepolia"
                  ? opSepoliaProvider
                  : null;
         
              if (provider && item.address != null) {
                contract = new ethers.Contract(item.address, contractABI, provider);
              } else{
                contract = null
              }
            return {
              symbol: item.symbol,
              name: item.name,
              contractAddress: item.address,
              blockchain: item.blockchain,
              decimals: item.decimals,
              instance: contract
            };
          })
        );
    
    cachedInstances = instances;
    return instances
}





