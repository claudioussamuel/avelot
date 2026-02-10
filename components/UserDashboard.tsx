'use client';

import { useState, useEffect } from 'react';
import { useAaveLottery, HistoryItem } from '@/hooks/useAaveLottery';
import { formatUnits } from 'viem';

const USDC_DECIMALS = 6;

export default function UserDashboard() {
  const {
    userTicket,
    currentRound,
    currentRoundId,
    fetchHistory,
    address,
    claimWinnings,
    exitLottery,
    refreshRoundData
  } = useAaveLottery();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState<bigint | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (address && currentRoundId) {
        setLoadingHistory(true);
        try {
          const items = await fetchHistory(address);
          setHistory(items);
        } catch (error: any) {
          console.error("Failed to load history", error);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    loadHistory();
  }, [address, currentRoundId, fetchHistory]);

  const handleClaim = async (roundId: bigint) => {
    setActionLoading(roundId);
    try {
      await claimWinnings(roundId);
      // Refresh history
      if (address) {
        const items = await fetchHistory(address);
        setHistory(items);
      }
      await refreshRoundData();
    } catch (error: any) {
      console.error("Claim failed", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExit = async (roundId: bigint) => {
    setActionLoading(roundId);
    try {
      await exitLottery(roundId);
      // Refresh history
      if (address) {
        const items = await fetchHistory(address);
        setHistory(items);
      }
      await refreshRoundData();
    } catch (error: any) {
      console.error("Exit failed", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatus = (item: HistoryItem) => {
    if (!item.round.finalized) return 'active';
    if (item.round.winner.toLowerCase() === address?.toLowerCase()) return 'won';
    return 'ended';
  };

  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const totalWinnings = history.reduce((acc, item) => {
    if (getStatus(item) === 'won' && item.ticket.claimed) {
      return acc + item.round.award;
    }
    return acc;
  }, BigInt(0));

  const roundsWon = history.filter(item => getStatus(item) === 'won').length;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Dashboard
        </h2>



        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-slate-100 text-sm mb-1">Total Deposited</p>
            <p className="text-3xl font-bold">
              {userTicket && userTicket.stake > BigInt(0) ? formatUnits(userTicket.stake, USDC_DECIMALS) : '0'}
            </p>
            <p className="text-sm text-slate-100 mt-1">USDC (Current Round)</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm mb-1">Active Tickets</p>
            <p className="text-3xl font-bold">
              {userTicket && userTicket.stake > BigInt(0) && !userTicket.exited ? '1' : '0'}
            </p>
            <p className="text-sm text-blue-100 mt-1">Current Round</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-cyan-100 text-sm mb-1">Total Winnings Claimed</p>
            <p className="text-3xl font-bold">
              {formatUnits(totalWinnings, USDC_DECIMALS)}
            </p>
            <p className="text-sm text-cyan-100 mt-1">USDC</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-emerald-100 text-sm mb-1">Rounds Won</p>
            <p className="text-3xl font-bold">{roundsWon}</p>
            <p className="text-sm text-emerald-100 mt-1">Lifetime</p>
          </div>
        </div>

        {/* Your Tickets */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Ticket History</h3>
            {loadingHistory && <span className="text-sm text-gray-500">Loading...</span>}
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.length === 0 && !loadingHistory && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No ticket history found.
              </div>
            )}

            {history.map((item) => {
              const status = getStatus(item);
              const isProcessing = actionLoading === item.roundId;

              return (
                <div key={item.roundId.toString()} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status === 'active' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          status === 'won' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`}>
                          {status === 'active' && (
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {status === 'won' && (
                            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          )}
                          {status === 'ended' && (
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Round #{item.roundId.toString()}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            status === 'won' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                            {status === 'active' ? 'Active' : status === 'won' ? 'Won!' : 'Ended'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Deposited: {formatUnits(item.ticket.stake, USDC_DECIMALS)} USDC
                          {status === 'active' && ` • Ends: ${formatTime(item.round.endTime)}`}
                          {status === 'won' && ` • Prize: ${formatUnits(item.round.award, USDC_DECIMALS)} USDC`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {status === 'active' && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                      )}
                      {status === 'won' && !item.ticket.claimed && (
                        <button
                          onClick={() => handleClaim(item.roundId)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {isProcessing ? 'Claiming...' : 'Claim Prize'}
                        </button>
                      )}
                      {status === 'won' && item.ticket.claimed && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Prize Claimed</span>
                      )}
                      {status === 'ended' && !item.ticket.exited && (
                        <button
                          onClick={() => handleExit(item.roundId)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? 'Withdrawing...' : 'Withdraw'}
                        </button>
                      )}
                      {status === 'ended' && item.ticket.exited && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Withdrawn</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
