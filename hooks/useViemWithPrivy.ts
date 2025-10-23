import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useMemo } from "react";
import { 
    createWalletClient, 
    createPublicClient, 
    http, 
    getContract,
    custom,
    type Address,
    type Hash,
    type PublicClient,
    type WalletClient
} from "viem";
import { base } from "viem/chains";

// Base Mainnet RPC URL
const getRpcUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
};
 
export function useViemWithPrivy() {
    // Check if Privy is available
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    let user = null
    let authenticated = false
    let wallets: any[] = []
    
    // Only use Privy hooks if app ID is available
    if (privyAppId) {
        const privy = usePrivy()
        const walletData = useWallets()
        user = privy.user
        authenticated = privy.authenticated
        wallets = walletData.wallets
    }

    // Use Base Mainnet (Production)
    const currentChain = base;

    // Create public client for reading
    const publicClient = useMemo(() => {
        const rpcUrl = getRpcUrl();
        return createPublicClient({
            chain: currentChain,
            transport: http(rpcUrl),
        });
    }, [currentChain]);

    // Create wallet client for writing transactions
    const createWalletClientForTransaction = useCallback(async () => {
        if (!wallets || wallets.length === 0) {
            throw new Error("No wallet connected");
        }

        const wallet = wallets[0];
        if (!wallet) {
            throw new Error("Wallet is undefined");
        }

        const provider = await wallet.getEthereumProvider();
        if (!provider) {
            throw new Error("Provider is undefined");
        }

        // Check and switch chain if needed
        const currentChainId = await provider.request({ method: "eth_chainId" });
        if (currentChainId !== `0x${currentChain.id.toString(16)}`) {
            await wallet.switchChain(currentChain.id);
        }

        return createWalletClient({
            chain: currentChain,
            transport: custom(provider),
            account: user?.wallet?.address as Address,
        });
    }, [wallets, currentChain, user?.wallet?.address]);

    // Get contract instance
    const getContractInstance = useCallback(async (address: Address, abi: any) => {
        const walletClient = await createWalletClientForTransaction();
        
        return getContract({
            address,
            abi,
            client: walletClient,
        });
    }, [createWalletClientForTransaction]);

    // Read contract function
    const readContract = useCallback(async (
        address: Address,
        abi: any,
        functionName: string,
        args?: any[]
    ) => {
        if (!publicClient) throw new Error("Public client not available");
        
        return await publicClient.readContract({
            address,
            abi,
            functionName,
            args: args || [],
        });
    }, [publicClient]);

    // Write contract function
    const writeContract = useCallback(async (
        address: Address,
        abi: any,
        functionName: string,
        args?: any[]
    ): Promise<Hash> => {
        const contract = await getContractInstance(address, abi);
        
        return await contract.write[functionName](args || []);
    }, [getContractInstance]);

    // Wait for transaction receipt
    const waitForTransactionReceipt = useCallback(async (hash: Hash) => {
        if (!publicClient) throw new Error("Public client not available");
        
        return await publicClient.waitForTransactionReceipt({ hash });
    }, [publicClient]);

    return {
        authenticated,
        user,
        currentChain,
        publicClient,
        createWalletClientForTransaction,
        getContractInstance,
        readContract,
        writeContract,
        waitForTransactionReceipt,
        address: user?.wallet?.address as Address | undefined,
    };
}
