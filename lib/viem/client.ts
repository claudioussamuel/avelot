import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, base, sepolia, mainnet } from "viem/chains";

// Get the appropriate RPC URL based on the chain
const getRpcUrl = (chainId: number) => {
    switch (chainId) {
        case baseSepolia.id:
            return process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";
        case base.id:
            return process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
        case sepolia.id:
            return process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`;
        case mainnet.id:
            return process.env.NEXT_PUBLIC_MAINNET_RPC_URL || `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`;
        default:
            return "https://sepolia.base.org";
    }
};

// Create public client for reading from blockchain
export const createViemClient = (chainId: number = baseSepolia.id) => {
    const rpcUrl = getRpcUrl(chainId);
    const chain = chainId === baseSepolia.id ? baseSepolia : 
                  chainId === base.id ? base : 
                  chainId === sepolia.id ? sepolia : mainnet;
    
    return createPublicClient({
        chain,
        transport: http(rpcUrl),
    });
};

// For server-side operations (like cron jobs)
const PRIVATE_KEY = process.env.NEXT_PUBLIC_META_MASK_PRIVATE_KEY
    ? process.env.NEXT_PUBLIC_META_MASK_PRIVATE_KEY.startsWith("0x")
        ? (process.env.NEXT_PUBLIC_META_MASK_PRIVATE_KEY as `0x${string}`)
        : (`0x${process.env.NEXT_PUBLIC_META_MASK_PRIVATE_KEY}` as `0x${string}`)
    : null;

export const account = PRIVATE_KEY ? privateKeyToAccount(PRIVATE_KEY) : null;

// Default client for Base Sepolia
export const client = createViemClient(baseSepolia.id);
