import { useCallback, useEffect, useState } from "react";
import { useViemWithPrivy } from "./useViemWithPrivy";
import { USDC_ADDRESS, AAVE_LOTTERY_ADDRESS } from "@/constants/contracts";
import { ERC20_ABI } from "@/constants/erc20-abi";
import type { Address } from "viem";

export function useUSDC() {
  const { readContract, writeContract, waitForTransactionReceipt, address, authenticated } = useViemWithPrivy();
  
  const [balance, setBalance] = useState<bigint | null>(null);
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch USDC balance
  const fetchBalance = useCallback(async (userAddress?: Address) => {
    const addr = userAddress || address;
    if (!addr) return null;

    try {
      const bal = await readContract(
        USDC_ADDRESS,
        ERC20_ABI,
        "balanceOf",
        [addr]
      ) as bigint;
      setBalance(bal);
      return bal;
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      return null;
    }
  }, [readContract, address]);

  // Fetch allowance for lottery contract
  const fetchAllowance = useCallback(async (userAddress?: Address) => {
    const addr = userAddress || address;
    if (!addr) return null;

    try {
      const allow = await readContract(
        USDC_ADDRESS,
        ERC20_ABI,
        "allowance",
        [addr, AAVE_LOTTERY_ADDRESS]
      ) as bigint;
      setAllowance(allow);
      return allow;
    } catch (error) {
      console.error("Error fetching USDC allowance:", error);
      return null;
    }
  }, [readContract, address]);

  // Approve USDC spending
  const approve = useCallback(async (amount: bigint) => {
    if (!authenticated) {
      throw new Error("Please connect your wallet first");
    }

    setLoading(true);
    try {
      const hash = await writeContract(
        USDC_ADDRESS,
        ERC20_ABI,
        "approve",
        [AAVE_LOTTERY_ADDRESS, amount]
      );

      console.log("Approval transaction submitted:", hash);
      
      const receipt = await waitForTransactionReceipt(hash);
      console.log("Approval confirmed:", receipt);
      
      // Refresh allowance after approval
      await fetchAllowance();
      
      return receipt;
    } catch (error) {
      console.error("Error approving USDC:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authenticated, writeContract, waitForTransactionReceipt, fetchAllowance]);

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback((amount: bigint) => {
    if (!balance) return false;
    return balance >= amount;
  }, [balance]);

  // Check if user has sufficient allowance
  const hasSufficientAllowance = useCallback((amount: bigint) => {
    if (!allowance) return false;
    return allowance >= amount;
  }, [allowance]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (address) {
      await Promise.all([
        fetchBalance(address),
        fetchAllowance(address)
      ]);
    }
  }, [address, fetchBalance, fetchAllowance]);

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

    // Helper functions
    hasSufficientBalance,
    hasSufficientAllowance,
  };
}
