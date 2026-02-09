"use client"

import { useEffect, useState } from 'react';
import { Calendar, Trophy, Users, Gift } from 'lucide-react';
import { Raffle, UserEntry, RecentWinner } from '@/lib/types';
import { convertFromWei, formatTimeLeft } from '@/lib/raffleUtils';
import { useAaveLottery } from '@/hooks/useAaveLottery';
import { useUSDC } from '@/hooks/useUSDC';
import Header from '@/components/Header';

// Components
import { RaffleCard } from '@/components/custom/raffle-card';
import { MyEntriesSection } from '@/components/custom/my-entries';
import { WinnersSection } from '@/components/custom/winners-section';
import { EntryModal } from '@/components/custom/entry-modal';
import { DepositModal } from '@/components/custom/deposit-modal';
import { BottomNav } from '@/components/custom/BottomNav';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [myEntries, setMyEntries] = useState<UserEntry[]>([]);

  const {
    currentRoundId,
    currentRound,
    userTicket,
    activeRounds,
    loading: lotteryLoading,
    authenticated,
    address,
    enterLottery,
    exitLottery,
    claimWinnings,
    finalizeRound,
  } = useAaveLottery();

  const { balance: usdcBalance } = useUSDC();

  // Process current round into Raffle object
  useEffect(() => {
    if (currentRoundId !== null && currentRound) {
      const raffle: Raffle = {
        id: Number(currentRoundId),
        name: `Round #${currentRoundId}`,
        type: 'Current Draw',
        prize: `$${convertFromWei(currentRound.award).toFixed(2)}`,
        entries: Number(currentRound.totalStake) / 1000000,
        timeLeft: formatTimeLeft(Math.max(0, Number(currentRound.endTime) - Date.now() / 1000)),
        endDate: new Date(Number(currentRound.endTime) * 1000).toLocaleDateString(),
        endTime: Number(currentRound.endTime),
        ticketPrice: '$0',
        odds: `1:${currentRound.totalStake > 0 ? (currentRound.totalStake / BigInt(1000000)).toString() : '1'}`,
        color: 'from-blue-600 to-indigo-600',
        finalized: currentRound.finalized,
        winner: currentRound.winner !== '0x0000000000000000000000000000000000000000' ? currentRound.winner : undefined,
      };
      setRaffles([raffle]);
    }
  }, [currentRoundId, currentRound]);

  // Process user entries
  useEffect(() => {
    if (authenticated && userTicket && currentRoundId !== null) {
      const entries: UserEntry[] = [];
      if (userTicket.stake > 0) {
        const isWinner = currentRound?.winner?.toLowerCase() === address?.toLowerCase();
        entries.push({
          raffleId: Number(currentRoundId),
          tickets: Number(userTicket.stake) / 1000000,
          position: isWinner ? 'Winner' : (currentRound?.finalized ? 'Completed' : 'Active'),
          isWinner: isWinner,
          finalized: currentRound?.finalized
        });
      }
      setMyEntries(entries);
    }
  }, [authenticated, userTicket, currentRoundId, currentRound, address]);

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

  const handlePurchase = async (raffle: Raffle, amount: number) => {
    try {
      if (!currentRoundId) throw new Error("No active round");
      await enterLottery(BigInt(raffle.id), BigInt(amount * 1000000));
      setSelectedRaffle(null);
      alert('Successfully entered the raffle!');
    } catch (error) {
      console.error(error);
      alert('Failed to enter raffle. Check console for details.');
    }
  };

  const handleExitRaffle = async (raffleId: number) => {
    try {
      await exitLottery(BigInt(raffleId));
      alert('Successfully withdrawn contribution!');
    } catch (error) {
      console.error(error);
      alert('Failed to withdraw. Check console for details.');
    }
  };

  const handleClaimPrize = async (raffleId: number) => {
    try {
      await claimWinnings(BigInt(raffleId));
      alert('Prize claimed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to claim prize. Check console for details.');
    }
  };

  const handleFinalize = async (raffleId: number) => {
    try {
      await finalizeRound(BigInt(raffleId));
      alert('Round finalized successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to finalize round. Check console for details.');
    }
  };

  const handleDeposit = (amount: number) => {
    setShowDepositModal(false);
    alert(`This is a demo. Please use the "Enter Raffle" button to stake USDC.`);
  };

  const RafflesPage = () => (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">All Draws</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {raffles.map((raffle) => (
          <RaffleCard key={raffle.id} raffle={raffle} onEnter={setSelectedRaffle} onFinalize={handleFinalize} />
        ))}
      </div>
    </div>
  );

  const WinnersPage = () => (
    <div className="mb-20">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Recent Winners</h2>
      <div className="bg-white rounded-xl shadow-md p-6">
        <WinnersSection winners={recentWinners} />
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
              {raffles.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} onEnter={setSelectedRaffle} onFinalize={handleFinalize} />
              ))}
              {raffles.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-400 font-medium">No active raffles found. Please check back later.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">My Entries</h3>
                {authenticated ? (
                  <MyEntriesSection
                    entries={myEntries}
                    raffles={raffles}
                    onClaim={handleClaimPrize}
                    onExit={handleExitRaffle}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-medium">Please connect your wallet to view your entries.</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Top Winners</h3>
                <WinnersSection winners={recentWinners} />
              </div>
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
