# Holdings MVP – NextJS Website

This repository contains the website logic for the **Holdings MVP** project, responsible for fetching and showing wallet token balances across multiple EVM-compatible chains using a NextJS application.
🔗 **Live Website**: [https://holdings-mvp.vercel.app](https://holdings-mvp.vercel.app)
---

## 📌 Overview

The cron system periodically fetches ERC-20 and native token balances for a set of tracked wallets using a **custom Multicall smart contract**, reducing RPC overhead and ensuring data is stored in a structured MongoDB database for frontend consumption.

---

## 🧩 Tech Stack

- Node.js + TypeScript
- ethers.js
- MongoDB
- PM2 (for scheduling in production)
- Custom Solidity Multicall contract

---

### 🔧 Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- RPC endpoints for Ethereum, Optimism, ZetaChain, etc.
- A deployed instance of your custom Multicall contract

---

### 📄 Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongo_connection
ethSepoliaRPC=https://...
opSepoliaRPC=https://...
zetaChainRPC=https://...

ethSepoliaAddress=deployed_multicall_address
opSepoliaAddress=deployed_multicall_address
zetaChainAddress=deployed_multicall_address

coingeckoAPI=your_api_key


### ▶️ Running Locally

npm install
npm run build
npm run start
