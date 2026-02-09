import { useCallback, useEffect, useState } from "react";
import { useViemWithPrivy } from "./useViemWithPrivy";
import { CHAINS_TO_CONTRACTS } from "@/constants/contracts";
import { type Address, erc20Abi } from "viem";

export function useUSDC() {
  const {
    readContract,
    writeContract,
    waitForTransactionReceipt,
    publicClient,
    address,
    authenticated,
    chainId
  } = useViemWithPrivy();

  const usdcAddress = (CHAINS_TO_CONTRACTS[chainId]?.usdc || CHAINS_TO_CONTRACTS[8453].usdc) as Address;
  const raffleAddress = (CHAINS_TO_CONTRACTS[chainId]?.raffle || CHAINS_TO_CONTRACTS[8453].raffle) as Address;

  const [balance, setBalance] = useState<bigint | null>(null);
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch USDC balance
  const fetchBalance = useCallback(async (userAddress?: Address) => {
    const addr = userAddress || address;
    if (!addr) return null;

    try {
      const bal = await readContract(
        usdcAddress,
        erc20Abi,
        "balanceOf",
        [addr]
      ) as bigint;
      setBalance(bal);
      return bal;
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      return null;
    }
  }, [readContract, address, usdcAddress]);

  // Fetch allowance for lottery contract
  const fetchAllowance = useCallback(async (userAddress?: Address) => {
    const addr = userAddress || address;
    if (!addr) return null;

    try {
      const allow = await readContract(
        usdcAddress,
        erc20Abi,
        "allowance",
        [addr, raffleAddress]
      ) as bigint;
      setAllowance(allow);
      return allow;
    } catch (error) {
      console.error("Error fetching USDC allowance:", error);
      return null;
    }
  }, [readContract, address, usdcAddress, raffleAddress]);

  // Optimized refresh data using multicall
  const refreshData = useCallback(async () => {
    if (!address || !publicClient) return;

    try {
      const [balResult, allowResult] = await publicClient.multicall({
        contracts: [
          {
            address: usdcAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          },
          {
            address: usdcAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, raffleAddress],
          },
        ],
      });

      if (balResult.status === 'success') setBalance(balResult.result as bigint);
      if (allowResult.status === 'success') setAllowance(allowResult.result as bigint);
    } catch (error) {
      console.error("Error refreshing USDC data with multicall:", error);
      // Fallback to individual calls
      await Promise.all([fetchBalance(address), fetchAllowance(address)]);
    }
  }, [address, publicClient, usdcAddress, raffleAddress, fetchBalance, fetchAllowance]);

  // Transfer USDC
  const transfer = useCallback(async (to: Address, amount: bigint) => {
    if (!authenticated) throw new Error("Please connect your wallet first");

    setLoading(true);
    try {
      const hash = await writeContract(
        usdcAddress,
        erc20Abi,
        "transfer",
        [to, amount]
      );
      console.log("Transfer transaction submitted:", hash);
      const receipt = await waitForTransactionReceipt(hash);
      console.log("Transfer confirmed:", receipt);
      await refreshData();
      return receipt;
    } catch (error) {
      console.error("Error transferring USDC:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authenticated, writeContract, usdcAddress, waitForTransactionReceipt, refreshData]);

  // Approve USDC spending
  const approve = useCallback(async (amount: bigint) => {
    if (!authenticated) {
      throw new Error("Please connect your wallet first");
    }

    setLoading(true);
    try {
      const hash = await writeContract(
        usdcAddress,
        erc20Abi,
        "approve",
        [raffleAddress, amount]
      );

      console.log("Approval transaction submitted:", hash);

      const receipt = await waitForTransactionReceipt(hash);
      console.log("Approval confirmed:", receipt);

      // Refresh data after approval
      await refreshData();

      return receipt;
    } catch (error) {
      console.error("Error approving USDC:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authenticated, writeContract, usdcAddress, raffleAddress, waitForTransactionReceipt, refreshData]);

  // Watch for Transfer events
  useEffect(() => {
    if (!publicClient || !address || !usdcAddress) return;

    const unwatch = publicClient.watchContractEvent({
      address: usdcAddress,
      abi: erc20Abi,
      eventName: 'Transfer',
      onLogs: (logs) => {
        logs.forEach((log: any) => {
          const { from, to, value } = log.args;
          if (from?.toLowerCase() === address.toLowerCase() || to?.toLowerCase() === address.toLowerCase()) {
            console.log(`USDC Transfer detected: ${from} -> ${to} (${value} units)`);
            refreshData(); // Refresh balance/allowance on relevant transfers
          }
        });
      },
    });

    return () => unwatch();
  }, [publicClient, address, usdcAddress, refreshData]);

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback((amount: bigint) => {
    if (balance === null) return false;
    return balance >= amount;
  }, [balance]);

  // Check if user has sufficient allowance
  const hasSufficientAllowance = useCallback((amount: bigint) => {
    if (allowance === null) return false;
    return allowance >= amount;
  }, [allowance]);

  // Initialize data on mount and when address changes
  useEffect(() => {
    if (authenticated && address) {
      refreshData();
    }
  }, [authenticated, address, refreshData]);

  return {
    // State
    balance,
    allowance,
    loading,
    authenticated,
    address,

    // Read functions
    fetchBalance,
    fetchAllowance,
    refreshData,

    // Write functions
    approve,
    transfer,

    // Helper functions
    hasSufficientBalance,
    hasSufficientAllowance,
  };
}
