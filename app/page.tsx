"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Trophy, Users, Gift } from 'lucide-react';
import {
  useChainId,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';

// Types
import { Raffle, UserEntry, RecentWinner } from '@/lib/types';

// Utils
import { convertToWei, convertFromWei, formatTimeLeft } from '@/lib/raffleUtils';

// Constants
import { chainsToContracts, raffleAbi } from '@/constants';

// Components
import { RaffleCard } from '@/components/custom/raffle-card';
import { MyEntriesSection } from '@/components/custom/my-entries';
import { WinnersSection } from '@/components/custom/winners-section';
import { EntryModal } from '@/components/custom/entry-modal';
import { DepositModal } from '@/components/custom/deposit-modal';



export default function Home() {
  const router = useRouter();
  const { address: userAddress } = useAccount();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [balance, setBalance] = useState(250.00);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [myEntries, setMyEntries] = useState<UserEntry[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([]);
  const [pendingRaffleData, setPendingRaffleData] = useState<{ raffle: Raffle; ticketCount: number } | null>(null);
  const [pendingClaimRaffleId, setPendingClaimRaffleId] = useState<number | null>(null);
  const [pendingFinalizeRaffleId, setPendingFinalizeRaffleId] = useState<number | null>(null);

  // Get wagmi hooks
  const chainId = useChainId();
  const { writeContract: approveContract, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { writeContract: enterContract, data: enterHash, isPending: isEnterPending } = useWriteContract();
  const { writeContract: exitContract, data: exitHash, isPending: isExitPending } = useWriteContract();
  const { writeContract: claimContract, data: claimHash, isPending: isClaimPending } = useWriteContract();
  const { writeContract: finalizeContract, data: finalizeHash, isPending: isFinalizePending } = useWriteContract();

  const { 
        data: activeRounds, 
        isLoading: isLoadingRounds,
        error: roundsError
    } = useReadContract({
        address: chainsToContracts[chainId]?.raffle as `0x${string}` | undefined,
        abi: raffleAbi,
        functionName: 'getActiveRounds',
        chainId,
  });

  const { 
      data: nonFinalizedRaffles,
      isLoading: isLoadingNonFinalized,
      error: nonFinalizedError
   } = useReadContract({
      address: chainsToContracts[chainId]?.raffle as `0x${string}` | undefined,
      abi: raffleAbi,
      functionName: 'getNonFinalizedRaffles',
      chainId,
    query: {
      enabled: true,
    },
  });

  const { 
      data: finalizedRaffles,
      isLoading: isLoadingFinalized,
      error: finalizedError
   } = useReadContract({
      address: chainsToContracts[chainId]?.raffle as `0x${string}` | undefined,
      abi: raffleAbi,
      functionName: 'getFinalizedRaffles',
      chainId,
    query: {
      enabled: true,
    },
  });

  const { 
      data: userRounds,
      isLoading: isLoadingUserRounds, 
      error: userRoundsError
   } = useReadContract({
      address: chainsToContracts[chainId]?.raffle as `0x${string}` | undefined,
      abi: raffleAbi,
      functionName: 'getUserRounds',
      args: userAddress ? [userAddress] : undefined,
      chainId,
    query: {
      enabled: !!userAddress,
    },
  });

  // Monitor transaction completion
  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isEnterConfirming } = useWaitForTransactionReceipt({
    hash: enterHash,
  });

  const { isLoading: isExitConfirming } = useWaitForTransactionReceipt({
    hash: exitHash,
  });

  const { isLoading: isClaimConfirming } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const { isLoading: isFinalizeConfirming } = useWaitForTransactionReceipt({
    hash: finalizeHash,
  });

  // Handle finalize confirmation and call claim (if winner) or exit function automatically
  useEffect(() => {
    if (!isFinalizeConfirming && finalizeHash && pendingFinalizeRaffleId) {
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;

      if (contractAddress) {
        // Check if user is a winner
        const raffle = raffles.find(r => r.id === pendingFinalizeRaffleId);
        const isWinner = raffle && raffle.finalized && raffle.winner && raffle.winner.toLowerCase() === userAddress?.toLowerCase();

        if (isWinner) {
          // Call claim function for winners
          console.log('Claiming prize after finalize for ID:', pendingFinalizeRaffleId);
          setPendingClaimRaffleId(pendingFinalizeRaffleId);
          claimContract({
            address: contractAddress,
            abi: raffleAbi,
            functionName: 'claim',
            args: [BigInt(pendingFinalizeRaffleId)],
            chainId,
          });
        } else {
          // Call exit function for non-winners
          console.log('Exiting raffle after finalize for ID:', pendingFinalizeRaffleId);
          exitContract({
            address: contractAddress,
            abi: raffleAbi,
            functionName: 'exit',
            args: [BigInt(pendingFinalizeRaffleId)],
            chainId,
          });
        }

        // Clear pending finalize raffle ID
        setPendingFinalizeRaffleId(null);
      }
    }
  }, [isFinalizeConfirming, finalizeHash, pendingFinalizeRaffleId, chainId, raffles, userAddress]);

  // Fetch details for each active round
  useEffect(() => {
    const allRaffles: any[] = [];

    // Add non-finalized raffles
    if (nonFinalizedRaffles && (nonFinalizedRaffles as any[]).length > 0) {
      const nonFinalizedProcessed = (nonFinalizedRaffles as any[]).map((roundData: any) => {
        return {
          id: roundData.roundId,
          name: roundData.name,
          type: 'active',
          prize: `$${convertFromWei(BigInt(roundData.award)).toFixed(2)}`,
          entries: Number(roundData.totalStake) / 1000000,
          timeLeft: formatTimeLeft(Math.max(0, Number(roundData.endTime) - Date.now() / 1000)),
          endDate: new Date(Number(roundData.endTime) * 1000).toLocaleDateString(),
          endTime: Number(roundData.endTime),
          ticketPrice: '$0',
          odds: `1:${Number(roundData.totalStake)}`,
          color: 'from-blue-400 to-blue-600',
          finalized: false,
          winner: null,
        };
      });
      allRaffles.push(...nonFinalizedProcessed);
    }

    // Add finalized raffles
    if (finalizedRaffles && (finalizedRaffles as any[]).length > 0) {
      const finalizedProcessed = (finalizedRaffles as any[]).map((roundData: any) => {
        return {
          id: roundData.roundId,
          name: roundData.name,
          type: 'finalized',
          prize: `$${convertFromWei(BigInt(roundData.award)).toFixed(2)}`,
          entries: Number(roundData.totalStake) / 6,
          timeLeft: 'Ended',
          endDate: new Date(Number(roundData.endTime) * 1000).toLocaleDateString(),
          endTime: Number(roundData.endTime),
          ticketPrice: '$0',
          odds: `1:${Number(roundData.totalStake)}`,
          color: 'from-purple-400 to-purple-600',
          finalized: true,
          winner: roundData.winner,
        };
      });
      allRaffles.push(...finalizedProcessed);
    }

    setRaffles(allRaffles);
  }, [nonFinalizedRaffles, isLoadingNonFinalized, finalizedRaffles, isLoadingFinalized]);

  // Process finalized raffles to extract winners
  useEffect(() => {
    if (!finalizedRaffles || (finalizedRaffles as any[]).length === 0) {
      setRecentWinners([]);
      return;
    }

    const winners: RecentWinner[] = (finalizedRaffles as any[])
      .slice(-5) // Get last 5 finalized raffles
      .reverse()
      .map((roundData: any) => ({
        name: roundData.winner ? roundData.winner.slice(0, 6) + '...' : 'Unknown',
        raffle: roundData.name || 'Draw',
        prize: `$${convertFromWei(BigInt(roundData.award)).toFixed(2)}`,
        date: new Date(Number(roundData.endTime) * 1000).toLocaleDateString(),
      }));

    setRecentWinners(winners);
  }, [finalizedRaffles, isLoadingFinalized]);

  // Process user entries
  useEffect(() => {
    if (!userRounds || (userRounds as bigint[]).length === 0) {
      setMyEntries([]);
      return;
    }

    const entries: UserEntry[] = (userRounds as bigint[]).map((roundId: bigint) => {
      const roundIdNum = Number(roundId);
      const raffle = raffles.find(r => r.id === roundIdNum);
      const isWinner = raffle && raffle.finalized && raffle.winner && raffle.winner.toLowerCase() === userAddress?.toLowerCase();
      
      return {
        raffleId: roundIdNum,
        tickets: 1,
        position: isWinner ? 'Winner' : 'Active',
        isWinner: isWinner || false,
        finalized: raffle?.finalized || false,
      };
    });

    setMyEntries(entries);
  }, [userRounds, raffles, userAddress]);

  // Handle claim confirmation and call exit function automatically
  useEffect(() => {
    if (!isClaimConfirming && claimHash && pendingClaimRaffleId) {
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;

      if (contractAddress) {
        // Call exit function after claim is confirmed
        console.log('Exiting raffle after claim for ID:', pendingClaimRaffleId);
        exitContract({
          address: contractAddress,
          abi: raffleAbi,
          functionName: 'exit',
          args: [BigInt(pendingClaimRaffleId)],
          chainId,
        });

        // Clear pending claim raffle ID
        setPendingClaimRaffleId(null);
      }
    }
  }, [isClaimConfirming, claimHash, pendingClaimRaffleId, chainId, exitContract]);

  // Handle approval confirmation and call enter function
  useEffect(() => {
    if (!isApproveConfirming && approveHash && pendingRaffleData) {
      const { raffle, ticketCount } = pendingRaffleData;
      const amountInWei = convertToWei(ticketCount, 6);
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;

      if (contractAddress) {
        // Call enter function after approval is confirmed
        console.log('Entering raffle with ID:', raffle.id);
        enterContract({
          address: contractAddress,
          abi: raffleAbi,
          functionName: 'enter',
          args: [BigInt(raffle.id), amountInWei],
          chainId,
        });

        // Clear pending raffle data
        setPendingRaffleData(null);
      }
    }
  }, [isApproveConfirming, approveHash, pendingRaffleData, chainId, enterContract]);

  const handlePurchase = async (raffle: Raffle, ticketCount: number) => {
    try {
      setTransactionError(null);
      setTransactionLoading(true);

      // Convert ticket count to wei (assuming 18 decimals for the token)
      const amountInWei = convertToWei(ticketCount, 18);
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;
      const usdcAddress = chainsToContracts[chainId]?.usdc as `0x${string}` | undefined;

      if (!contractAddress) {
        throw new Error('Contract address not found for this chain');
      }

      if (!usdcAddress) {
        throw new Error('USDC address not found for this chain');
      }

      // Store the raffle data for later use after approval
      setPendingRaffleData({ raffle, ticketCount: ticketCount });

      // First, approve the raffle contract to spend USDC
      approveContract({
        address: usdcAddress,
        abi: [{"type":"function","name":"approve","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"}],
        functionName: 'approve',
        args: [contractAddress, amountInWei],
        chainId,
      });

      // Close modal after initiating transaction
      setSelectedRaffle(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to purchase tickets';
      setTransactionError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleExitRaffle = async (raffleId: number) => {
    try {
      setTransactionError(null);
      setTransactionLoading(true);
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;

      if (!contractAddress) {
        throw new Error('Contract address not found for this chain');
      }

      exitContract({
        address: contractAddress,
        abi: raffleAbi,
        functionName: 'exit',
        args: [BigInt(raffleId)],
        chainId,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to exit raffle';
      setTransactionError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleClaimPrize = async (raffleId: number) => {
    try {
      setTransactionError(null);
      setTransactionLoading(true);
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;

      if (!contractAddress) {
        throw new Error('Contract address not found for this chain');
      }

      // Store the raffle ID to exit after claim confirmation
      setPendingClaimRaffleId(raffleId);

      claimContract({
        address: contractAddress,
        abi: raffleAbi,
        functionName: 'claim',
        args: [BigInt(raffleId)],
        chainId,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim prize';
      setTransactionError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleFinalize = async (raffleId: number) => {
    try {
      setTransactionError(null);
      setTransactionLoading(true);
      const contractAddress = chainsToContracts[chainId]?.raffle as `0x${string}` | undefined;

      if (!contractAddress) {
        throw new Error('Contract address not found for this chain');
      }

      // Store the raffle ID to exit after finalize confirmation
      setPendingFinalizeRaffleId(raffleId);

      console.log('Finalizing raffle with ID:', raffleId);
      finalizeContract({
        address: contractAddress,
        abi: raffleAbi,
        functionName: 'finalizeRound',
        args: [BigInt(raffleId)],
        chainId,
      });

      // Close modal after initiating transaction
      setSelectedRaffle(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to finalize raffle';
      setTransactionError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleDeposit = (amount: number) => {
    setBalance(prev => prev + amount);
    setShowDepositModal(false);
    alert(`Successfully deposited $${amount}`);
  };

  const RafflesPage = () => {
    const filteredRaffles = filterType === 'all'
      ? raffles
      : raffles.filter((r: Raffle) => r.type === filterType);

    const filterOptions = [
      { id: 'all', label: 'All Draws' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'monthly', label: 'Monthly' },
      { id: 'bimonthly', label: 'Bi-Monthly' },
      { id: 'quarterly', label: 'Quarterly' },
      { id: 'halfyear', label: 'Half-Year' },
    ];

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">All Raffles</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setFilterType(option.id)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${filterType === option.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredRaffles.map((raffle: Raffle) => (
            <RaffleCard key={raffle.id} raffle={raffle} onEnter={setSelectedRaffle} onFinalize={handleFinalize} />
          ))}
        </div>
      </div>
    );
  };

  const SchedulePage = () => (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-6">Draw Schedule</h2>
      <div className="space-y-4">
        {raffles.map((raffle: Raffle) => (
          <div key={raffle.id} className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{raffle.name}</h3>
                <p className="text-gray-600 text-sm mt-1">Prize: {raffle.prize}</p>
                <p className="text-gray-600 text-sm">Frequency: {raffle.type}</p>
              </div>
              <div className="text-right">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  {raffle.timeLeft}
                </div>
                <p className="text-gray-600 text-sm">{raffle.endDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SupportPage = () => (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-6">Support</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">How to Play</h3>
          <ol className="space-y-2 text-gray-700">
            <li>1. Choose a raffle from the available draws</li>
            <li>2. Select the number of tickets you want to purchase</li>
            <li>3. Complete your purchase</li>
            <li>4. Wait for the draw date</li>
            <li>5. Winners are announced automatically</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <p className="text-gray-700 mb-2">Email: claudiouso00@gmail.com</p>
          <p className="text-gray-700 mb-2">Phone: 1-800-MYBET-24</p>
          <p className="text-gray-700">Hours: 24/7</p>
        </div>
      </div>
    </div>
  );

  const WinnersPage = () => (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-6  text-black">Recent Winners</h2>
      <div className="bg-white rounded-xl shadow-md p-6">
        <WinnersSection winners={recentWinners} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
   
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-black">Active Raffles</h2>
              <p className="text-gray-600">Choose your draw and win big prizes!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {raffles.map((raffle: Raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} onEnter={setSelectedRaffle} onFinalize={handleFinalize} />
              ))}
            </div>
            {raffles.length === 0 && isLoadingRounds && (
              <div className="text-center py-8 text-gray-500">
                <p>Loading raffles...</p>
              </div>
            )}
            {raffles.length === 0 && !isLoadingRounds && (
              <div className="text-center py-8 text-gray-500">
                <p>No active raffles at the moment.</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">My Entries</h2>
                {userAddress ? (
                  <MyEntriesSection entries={myEntries} raffles={raffles} onClaim={handleClaimPrize} onExit={handleExitRaffle} />
                ) : (
                  <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                    <p>Please connect your wallet to view your entries.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'raffles' && <RafflesPage />}
        {activeTab === 'winners' && <WinnersPage />}
        {activeTab === 'schedule' && <SchedulePage />}
        {activeTab === 'support' && <SupportPage />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-around">
          {[
            { id: 'home', icon: Gift, label: 'Home' },
            { id: 'raffles', icon: Trophy, label: 'Raffles' },
            { id: 'winners', icon: Trophy, label: 'Winners' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'support', icon: Users, label: 'Support' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <tab.icon size={24} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <EntryModal
        raffle={selectedRaffle}
        onClose={() => setSelectedRaffle(null)}
        onPurchase={handlePurchase}
        onFinalize={handleFinalize}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
        currentBalance={balance}
      />
    </div>
  );
}
