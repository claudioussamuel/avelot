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
import { base, optimism } from "viem/chains";

// Supported chains mapping
const SUPPORTED_CHAINS: Record<number, any> = {
    [base.id]: base,
};

// Base Mainnet RPC URL
const getRpcUrl = (chainId: number) => {
    return process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
};

export function useViemWithPrivy() {
    // Check if Privy is available
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    let user: any = null
    let authenticated = false
    let login = () => { }
    let logout = () => { }
    let wallets: any[] = []

    // Only use Privy hooks if app ID is available
    if (privyAppId) {
        const privy = usePrivy()
        const walletData = useWallets()
        user = privy.user
        authenticated = privy.authenticated
        login = privy.login
        logout = privy.logout
        wallets = walletData.wallets
    }

    // Determine current chain
    const chainId = useMemo(() => {
        if (wallets && wallets.length > 0) {
            const chainIdStr = wallets[0].chainId;
            if (chainIdStr) {
                // Privy chainId is usually "eip155:XXXX" or just "XXXX"
                const id = parseInt(chainIdStr.split(':').pop() || '8453');
                return SUPPORTED_CHAINS[id] ? id : base.id;
            }
        }
        return base.id;
    }, [wallets]);

    const currentChain = SUPPORTED_CHAINS[chainId] || base;

    // Create public client for reading
    const publicClient = useMemo(() => {
        const rpcUrl = getRpcUrl(chainId);
        return createPublicClient({
            chain: currentChain,
            transport: http(rpcUrl),
        });
    }, [currentChain, chainId]);

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
            client: { public: publicClient, wallet: walletClient },
        });
    }, [createWalletClientForTransaction, publicClient]);

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
        } as any);
    }, [publicClient]);

    // Write contract function
    const writeContract = useCallback(async (
        address: Address,
        abi: any,
        functionName: string,
        args?: any[]
    ): Promise<Hash> => {
        const contract = await getContractInstance(address, abi);

        return await (contract.write as any)[functionName](args || []);
    }, [getContractInstance]);

    // Wait for transaction receipt
    const waitForTransactionReceipt = useCallback(async (hash: Hash) => {
        if (!publicClient) throw new Error("Public client not available");

        return await publicClient.waitForTransactionReceipt({ hash });
    }, [publicClient]);

    // Switch network to a specific chain
    const switchNetwork = useCallback(async (targetChainId: number) => {
        if (!wallets || wallets.length === 0) {
            throw new Error("No wallet connected");
        }

        const wallet = wallets[0];
        if (!wallet) {
            throw new Error("Wallet is undefined");
        }

        try {
            await wallet.switchChain(targetChainId);
        } catch (error) {
            console.error("Error switching network:", error);
            throw error;
        }
    }, [wallets]);

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
        switchNetwork,
        login,
        logout,
        address: user?.wallet?.address as Address | undefined,
        chainId,
    };
}
