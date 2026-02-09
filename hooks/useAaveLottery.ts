import { useCallback, useEffect, useState } from "react";
import { useViemWithPrivy } from "./useViemWithPrivy";
import { CHAINS_TO_CONTRACTS, AAVE_LOTTERY_ABI } from "@/constants/contracts";
import type { Address } from "viem";

export interface Round {
  roundId: bigint;
  name: string;
  endTime: bigint;
  duration: bigint;
  totalStake: bigint;
  award: bigint;
  winnerTicket: bigint;
  winner: Address;
  scaledBalanceStake: bigint;
  finalized: boolean;
  exists: boolean;
}

export interface Ticket {
  stake: bigint;
  segmentStart: bigint;
  exited: boolean;
  claimed: boolean;
}

export interface HistoryItem {
  roundId: bigint;
  round: Round;
  ticket: Ticket;
}

export function useAaveLottery() {
  const { readContract, writeContract, waitForTransactionReceipt, address, authenticated, publicClient, chainId } = useViemWithPrivy();
  const contractAddress = (CHAINS_TO_CONTRACTS[chainId]?.raffle || CHAINS_TO_CONTRACTS[8453].raffle) as Address;

  const [currentRoundId, setCurrentRoundId] = useState<bigint | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [userTicket, setUserTicket] = useState<Ticket | null>(null);
  const [underlyingToken, setUnderlyingToken] = useState<Address | null>(null);
  const [activeRounds, setActiveRounds] = useState<bigint[]>([]);
  const [loading, setLoading] = useState(false);

  // Read current round ID
  // Read current round ID (latest round created)
  const fetchCurrentRoundId = useCallback(async () => {
    try {
      const nextId = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "nextRoundId"
      ) as bigint;

      const id = nextId > 0n ? nextId - 1n : 0n;
      setCurrentRoundId(id);
      return id;
    } catch (error) {
      console.error("Error fetching current round ID:", error);
      return null;
    }
  }, [readContract, contractAddress]);

  // Read round details
  const fetchRound = useCallback(async (roundId: bigint) => {
    try {
      const round = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "getRound",
        [roundId]
      ) as Round;
      setCurrentRound(round);
      return round;
    } catch (error) {
      console.error("Error fetching round:", error);
      return null;
    }
  }, [readContract]);

  // Read user ticket
  const fetchUserTicket = useCallback(async (roundId: bigint, userAddress: Address) => {
    try {
      const ticket = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "getTicket",
        [roundId, userAddress]
      ) as Ticket;
      setUserTicket(ticket);
      return ticket;
    } catch (error) {
      console.error("Error fetching user ticket:", error);
      return null;
    }
  }, [readContract]);

  // Read round duration
  // Read active rounds
  const fetchActiveRounds = useCallback(async () => {
    try {
      const rounds = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "getActiveRounds"
      ) as bigint[];
      setActiveRounds(rounds);
      return rounds;
    } catch (error) {
      console.error("Error fetching active rounds:", error);
      return [];
    }
  }, [readContract, contractAddress]);

  // Read underlying token address
  const fetchUnderlyingToken = useCallback(async () => {
    try {
      const token = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "underlying"
      ) as Address;
      setUnderlyingToken(token);
      return token;
    } catch (error) {
      console.error("Error fetching underlying token:", error);
      return null;
    }
  }, [readContract]);

  // Fetch active round for a user
  // Fetch rounds for a user
  const fetchUserRounds = useCallback(async (userAddress: Address) => {
    try {
      const rounds = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "getUserRounds",
        [userAddress]
      ) as bigint[];
      return rounds;
    } catch (error) {
      console.error("Error fetching user rounds:", error);
      return [];
    }
  }, [readContract, contractAddress]);

  // Direct read from rounds mapping
  const fetchRoundDirect = useCallback(async (roundId: bigint) => {
    try {
      const roundData = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "rounds",
        [roundId]
      );
      return roundData;
    } catch (error) {
      console.error("Error fetching round directly:", error);
      return null;
    }
  }, [readContract]);

  // Direct read from tickets mapping
  const fetchTicketDirect = useCallback(async (roundId: bigint, userAddress: Address) => {
    try {
      const ticketData = await readContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "tickets",
        [roundId, userAddress]
      );
      return ticketData;
    } catch (error) {
      console.error("Error fetching ticket directly:", error);
      return null;
    }
  }, [readContract]);

  // Enter lottery
  // Enter lottery
  const enterLottery = useCallback(async (roundId: bigint, amount: bigint) => {
    if (!authenticated) {
      throw new Error("Please connect your wallet first");
    }

    setLoading(true);
    try {
      const hash = await writeContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "enter",
        [roundId, amount]
      );

      console.log("Transaction submitted:", hash);

      const receipt = await waitForTransactionReceipt(hash);
      console.log("Transaction confirmed:", receipt);

      // Refresh data after successful entry
      await fetchCurrentRoundId();
      if (address) {
        await fetchUserTicket(roundId, address);
      }

      return receipt;
    } catch (error) {
      console.error("Error entering lottery:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authenticated, writeContract, waitForTransactionReceipt, fetchCurrentRoundId, fetchUserTicket, address, contractAddress]);

  // Exit lottery
  const exitLottery = useCallback(async (roundId: bigint) => {
    if (!authenticated) {
      throw new Error("Please connect your wallet first");
    }

    setLoading(true);
    try {
      const hash = await writeContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "exit",
        [roundId]
      );

      console.log("Transaction submitted:", hash);

      const receipt = await waitForTransactionReceipt(hash);
      console.log("Transaction confirmed:", receipt);

      // Refresh data after successful exit
      if (address) {
        await fetchUserTicket(roundId, address);
      }

      return receipt;
    } catch (error) {
      console.error("Error exiting lottery:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authenticated, writeContract, waitForTransactionReceipt, fetchUserTicket, address]);

  // Claim winnings
  const claimWinnings = useCallback(async (roundId: bigint) => {
    if (!authenticated) {
      throw new Error("Please connect your wallet first");
    }

    setLoading(true);
    try {
      const hash = await writeContract(
        contractAddress,
        AAVE_LOTTERY_ABI,
        "claim",
        [roundId]
      );

      console.log("Transaction submitted:", hash);

      const receipt = await waitForTransactionReceipt(hash);
      console.log("Transaction confirmed:", receipt);

      return receipt;
    } catch (error) {
      console.error("Error claiming winnings:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authenticated, writeContract, waitForTransactionReceipt]);

  // Initialize data on mount and when address changes
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchActiveRounds(),
        fetchUnderlyingToken()
      ]);

      const roundId = await fetchCurrentRoundId();

      if (roundId !== null) {
        await fetchRound(roundId);

        if (address) {
          await Promise.all([
            fetchUserTicket(roundId, address),
            fetchUserRounds(address)
          ]);
        }
      }
    };

    if (authenticated) {
      initializeData();
    }
  }, [authenticated, address, fetchCurrentRoundId, fetchRound, fetchUserTicket, fetchActiveRounds, fetchUnderlyingToken, fetchUserRounds]);

  // Refresh current round data
  const refreshRoundData = useCallback(async () => {
    const roundId = await fetchCurrentRoundId();
    if (roundId !== null) {
      await fetchRound(roundId);
      if (address) {
        await Promise.all([
          fetchUserTicket(roundId, address),
          fetchUserRounds(address)
        ]);
      }
    }
  }, [fetchCurrentRoundId, fetchRound, fetchUserTicket, fetchUserRounds, address]);

  return {
    // State
    currentRoundId,
    currentRound,
    userTicket,
    activeRounds,
    underlyingToken,
    loading,
    authenticated,
    address,

    // Read functions
    fetchCurrentRoundId,
    fetchRound,
    fetchUserTicket,
    fetchActiveRounds,
    fetchUnderlyingToken,
    fetchUserRounds,
    fetchRoundDirect,
    fetchTicketDirect,
    refreshRoundData,

    // Write functions
    createRound: useCallback(async (name: string, duration: bigint) => {
      if (!authenticated) {
        throw new Error("Please connect your wallet first");
      }

      setLoading(true);
      try {
        const hash = await writeContract(
          contractAddress,
          AAVE_LOTTERY_ABI,
          "createRound",
          [name, duration]
        );
        const receipt = await waitForTransactionReceipt(hash);
        await fetchCurrentRoundId();
        return receipt;
      } catch (error) {
        console.error("Error creating round:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [authenticated, writeContract, waitForTransactionReceipt, fetchCurrentRoundId, contractAddress]),
    enterLottery,
    exitLottery,
    claimWinnings,
    finalizeRound: useCallback(async (roundId: bigint) => {
      if (!authenticated) {
        throw new Error("Please connect your wallet first");
      }

      setLoading(true);
      try {
        const hash = await writeContract(
          contractAddress,
          AAVE_LOTTERY_ABI,
          "finalizeRound",
          [roundId]
        );
        console.log("Transaction submitted:", hash);

        const receipt = await waitForTransactionReceipt(hash);
        console.log("Transaction confirmed:", receipt);

        // Refresh data after successful finalization
        await fetchCurrentRoundId();
        if (currentRoundId) {
          await fetchRound(currentRoundId);
        }

        return receipt;
      } catch (error) {
        console.error("Error finalizing round:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [authenticated, writeContract, waitForTransactionReceipt, fetchCurrentRoundId, fetchRound, currentRoundId, contractAddress]),
    fetchParticipants: useCallback(async (roundId: bigint) => {
      if (!publicClient) return [];
      try {
        const logs = await publicClient.getLogs({
          address: contractAddress,
          event: {
            type: 'event',
            name: 'UserEntered',
            inputs: [
              { type: 'uint256', name: 'roundId', indexed: true },
              { type: 'address', name: 'user', indexed: true },
              { type: 'uint256', name: 'amount', indexed: false },
              { type: 'uint256', name: 'segmentStart', indexed: false }
            ]
          },
          args: {
            roundId: roundId
          },
          fromBlock: 'earliest'
        });

        // Extract unique users
        const users = new Set<Address>();
        logs.forEach(log => {
          if (log.args && log.args.user) {
            users.add(log.args.user);
          }
        });

        return Array.from(users);
      } catch (error) {
        console.error("Error fetching participants:", error);
        return [];
      }
    }, [publicClient]),
    fetchHistory: useCallback(async (userAddress: Address) => {
      if (!currentRoundId) return [];
      const history: HistoryItem[] = [];
      // Fetch last 10 rounds or up to round 0
      const startRound = currentRoundId;
      const endRound = currentRoundId > BigInt(10) ? currentRoundId - BigInt(10) : BigInt(0);

      for (let i = startRound; i >= endRound; i--) {
        try {
          const [round, ticket] = await Promise.all([
            readContract(contractAddress, AAVE_LOTTERY_ABI, "getRound", [i]) as Promise<Round>,
            readContract(contractAddress, AAVE_LOTTERY_ABI, "getTicket", [i, userAddress]) as Promise<Ticket>
          ]);

          if (ticket.stake > BigInt(0)) {
            history.push({ roundId: i, round, ticket });
          }
        } catch (e: any) {
          console.error(`Error fetching history for round ${i}`, e);
        }
      }
      return history;
    }, [currentRoundId, readContract])
  };
}
