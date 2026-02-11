"use client"

import { useEffect, useState } from 'react';
import { Raffle, RecentWinner } from '@/lib/types';
import { convertFromWei, formatTimeLeft, useRealTimeCountdown } from '@/lib/raffleUtils';
import { useAaveLottery } from '@/hooks/useAaveLottery';
import { useUSDC } from '@/hooks/useUSDC';
import Header from '@/components/Header';

// Components
import { RaffleCard } from '@/components/custom/raffle-card';
import { WinnersSection } from '@/components/custom/winners-section';
import { EntryModal } from '@/components/custom/entry-modal';
import { DepositModal } from '@/components/custom/deposit-modal';
import { BottomNav } from '@/components/custom/BottomNav';

import {  toast } from 'react-toastify';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([]);
  const [allWinners, setAllWinners] = useState<RecentWinner[]>([]);
  const [activeRaffles, setActiveRaffles] = useState<Raffle[]>([]);
  const [pastRaffles, setPastRaffles] = useState<Raffle[]>([]);
  const [userTickets, setUserTickets] = useState<Record<number, any>>({});
  const [allUserRounds, setAllUserRounds] = useState<bigint[]>([]);

  const {
    currentRoundId,
    currentRound,
    userTicket,
    activeRounds,
    nonFinalizedRaffles,
    finalizedRaffles,
    loading: lotteryLoading,
    authenticated,
    address,
    enterLottery,
    exitLottery,
    claimWinnings,
    finalizeRound,
    fetchUserRounds,
    fetchTicketDirect,
  } = useAaveLottery();

  const {
    balance: usdcBalance,
    allowance: usdcAllowance,
    approve: approveUSDC,
    loading: usdcLoading
  } = useUSDC();

  // Process non-finalized rounds into active Raffle objects
  useEffect(() => {
    if (nonFinalizedRaffles.length > 0) {
      const processedRaffles: Raffle[] = nonFinalizedRaffles.map(round => ({
        id: Number(round.roundId),
        name: round.name || `Round #${round.roundId}`,
        type: 'Active Draw',
        prize: `$${convertFromWei(round.award).toFixed(2)}`,
        entries: Number(round.totalStake) / 1000000,
        timeLeft: formatTimeLeft(Math.max(0, Number(round.endTime) - Date.now() / 1000)),
        endDate: new Date(Number(round.endTime) * 1000).toLocaleDateString(),
        endTime: Number(round.endTime),
        ticketPrice: '$0',
        odds: `1:${round.totalStake > BigInt(0) ? (round.totalStake / BigInt(1000000)).toString() : '1'}`,
        color: 'from-blue-600 to-indigo-600',
        finalized: round.finalized,
        winner: round.winner !== '0x0000000000000000000000000000000000000000' ? round.winner : undefined,
      }));
      setActiveRaffles(processedRaffles);
    } else {
      setActiveRaffles([]);
    }
  }, [nonFinalizedRaffles]);

  // Process finalized rounds into past Raffle objects
  useEffect(() => {
    if (finalizedRaffles.length > 0) {
      const processedRaffles: Raffle[] = finalizedRaffles.map((round: any) => ({
        id: Number(round.roundId),
        name: round.name || `Round #${round.roundId}`,
        type: 'Past Draw',
        prize: `$${convertFromWei(round.award).toFixed(2)}`,
        entries: Number(round.totalStake) / 1000000,
        timeLeft: 'Ended',
        endDate: new Date(Number(round.endTime) * 1000).toLocaleDateString(),
        endTime: Number(round.endTime),
        ticketPrice: '$0',
        odds: `1:${round.totalStake > BigInt(0) ? (round.totalStake / BigInt(1000000)).toString() : '1'}`,
        color: 'from-gray-600 to-gray-600',
        finalized: round.finalized,
        winner: round.winner !== '0x0000000000000000000000000000000000000000' ? round.winner : undefined,
        winnerTicket: Number(round.winnerTicket),
      }));
      setPastRaffles(processedRaffles);

      // Process all winners from finalized raffles
      const winners: RecentWinner[] = finalizedRaffles
        .filter((round: any) => round.winner !== '0x0000000000000000000000000000000000000000')
        .map((round: any) => ({
          name: round.winner.slice(0, 6) + '...' + round.winner.slice(-4),
          raffle: `Round #${round.roundId}`,
          prize: `$${convertFromWei(round.award).toFixed(2)}`,
          date: new Date(Number(round.endTime) * 1000).toLocaleDateString(),
        }));
      setAllWinners(winners);
    } else {
      setAllWinners([]);
    }
  }, [finalizedRaffles]);



  // Process recent winners
  useEffect(() => {
    if (currentRound && currentRound.winner !== '0x0000000000000000000000000000000000000000') {
      setRecentWinners([{
        name: currentRound.winner.slice(0, 6) + '...' + currentRound.winner.slice(-4),
        raffle: `Round #${currentRoundId}`,
        prize: `$${convertFromWei(currentRound.award).toFixed(2)}`,
        date: new Date(Number(currentRound.endTime) * 1000).toLocaleDateString()
      }]);
    } else {
      setRecentWinners([]);
    }
  }, [currentRound, currentRoundId]);

  // Fetch user tickets for all raffles
  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!address) return;

      const userRounds = await fetchUserRounds(address);
      setAllUserRounds(userRounds);

      const tickets: Record<number, any> = {};
      for (const roundId of userRounds) {
        try {
          const ticket = await fetchTicketDirect(roundId, address);
          if (ticket && ticket.stake > BigInt(0)) {
            tickets[Number(roundId)] = ticket;
          }
        } catch (error) {
          console.error(`Error fetching ticket for round ${roundId}:`, error);
        }
      }
      setUserTickets(tickets);
    };

    if (authenticated && address) {
      fetchUserTickets();
    }
  }, [authenticated, address, fetchUserRounds, fetchTicketDirect, nonFinalizedRaffles, finalizedRaffles]);

  const handlePurchase = async (raffle: Raffle, amount: number) => {
    try {
      if (!currentRoundId) throw new Error("No active round");
      await enterLottery(BigInt(raffle.id), BigInt(amount * 1000000));
      setSelectedRaffle(null);
      toast('Successfully entered the raffle!');
    } catch (error) {
      console.error(error);
      toast('Failed to enter raffle. Check console for details.');
    }
  };

  const handleExitRaffle = async (raffleId: number) => {
    try {
      await exitLottery(BigInt(raffleId));
      toast('Successfully withdrawn contribution!');
    } catch (error) {
      console.error(error);
      toast('Failed to withdraw. Check console for details.');
    }
  };

  const handleClaimPrize = async (raffleId: number) => {
    try {
      await claimWinnings(BigInt(raffleId));
      toast('Prize claimed successfully!');
    } catch (error) {
      console.error(error);
      toast('Failed to claim prize. Check console for details.');
    }
  };

  const handleFinalize = async (raffleId: number) => {
    try {
      await finalizeRound(BigInt(raffleId));
      toast('Round finalized successfully!');
    } catch (error) {
      console.error(error);
      toast('Failed to finalize round. Check console for details.');
    }
  };

  const handleDeposit = (amount: number) => {
    setShowDepositModal(false);
    toast(`This is a demo. Please use the "Enter Raffle" button to stake USDC.`);
  };

  const RafflesPage = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Past Raffles</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {pastRaffles.map((raffle) => (
          <RaffleCard key={raffle.id} raffle={raffle} onEnter={setSelectedRaffle} onFinalize={handleFinalize} onClaim={handleClaimPrize} onExit={handleExitRaffle} userTicket={userTickets[raffle.id]} userAddress={address} />
        ))}
        {pastRaffles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-medium">No past raffles found.</p>
          </div>
        )}
      </div>
    </div>
  );

  const WinnersPage = () => (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Recent Winners</h2>
      <div className="bg-white rounded-xl shadow-md p-6">
        <WinnersSection winners={allWinners} />
      </div>
    </div>
  );

  const SchedulePage = () => (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Draw Schedule</h2>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <p className="text-slate-600">Rounds occur regularly based on the contract duration configuration. Connect your wallet to see the current active round.</p>
      </div>
    </div>
  );

  const SupportPage = () => (
    <div className="mb-20 px-4">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Support</h2>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg mb-4 text-slate-900">How to Play</h3>
        <ol className="space-y-3 text-slate-600">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">1</span>
            Connect your wallet to the Base network.
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
            Approve and stake USDC into the active raffle.
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">3</span>
            Wait for the draw to end. Your principal is never at risk!
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Raffles</h2>
              <p className="text-slate-500 font-medium">No loss, pure gain. Stake USDC and win the prize pool.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {activeRaffles.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} onEnter={setSelectedRaffle} onFinalize={handleFinalize} />
              ))}
              {activeRaffles.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-400 font-medium">No active raffles found. Please check back later.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'raffles' && <RafflesPage />}
        {activeTab === 'winners' && <WinnersPage />}
        {activeTab === 'schedule' && <SchedulePage />}
        {activeTab === 'support' && <SupportPage />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <EntryModal
        raffle={selectedRaffle}
        onClose={() => setSelectedRaffle(null)}
        onPurchase={handlePurchase}
        onFinalize={handleFinalize}
        allowance={usdcAllowance || BigInt(0)}
        onApprove={async (amount) => {
          try {
            await approveUSDC(amount);
          } catch (error) {
            console.error(error);
            toast("Failed to approve USDC");
          }
        }}
        isApproving={usdcLoading}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
        currentBalance={Number(usdcBalance) || 0}
      />
    </div>
  );
}
