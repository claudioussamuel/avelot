'use client';

import { useState, useEffect } from 'react';
import { useAaveLottery } from '@/hooks/useAaveLottery';
import { useUSDC } from '@/hooks/useUSDC';
import { formatUnits, parseUnits } from 'viem';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

export default function LotteryInterface() {
  const {
    currentRoundId,
    currentRound,
    userTicket,
    roundDuration,
    loading,
    authenticated,
    address,
    enterLottery,
    exitLottery,
    claimWinnings,
    refreshRoundData,
  } = useAaveLottery();

  const {
    balance: usdcBalance,
    allowance: usdcAllowance,
    approve: approveUSDC,
    hasSufficientBalance,
    hasSufficientAllowance,
    refreshData: refreshUSDC,
  } = useUSDC();

  const [entryAmount, setEntryAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [, setTick] = useState(0); // Force re-render every second for countdown

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = async () => {
    if (!entryAmount || parseFloat(entryAmount) <= 0) {
      setTxError('Please enter a valid amount');
      return;
    }

    const amount = parseUnits(entryAmount, USDC_DECIMALS);

    // Check balance
    if (!hasSufficientBalance(amount)) {
      setTxError('Insufficient USDC balance');
      return;
    }

    setTxLoading(true);
    setTxError(null);
    setTxSuccess(null);

    try {
      // Check and approve if needed
      if (!hasSufficientAllowance(amount)) {
        setTxSuccess('Approving USDC...');
        await approveUSDC(amount);
        setTxSuccess('USDC approved! Entering lottery...');
        await refreshUSDC();
      }

      // Enter lottery
      await enterLottery(amount);
      setTxSuccess('Successfully entered the lottery!');
      setEntryAmount('');
      await Promise.all([refreshRoundData(), refreshUSDC()]);
    } catch (error: any) {
      setTxError(error.message || 'Failed to enter lottery');
    } finally {
      setTxLoading(false);
    }
  };

  const handleExit = async () => {
    if (!currentRoundId) return;

    setTxLoading(true);
    setTxError(null);
    setTxSuccess(null);

    try {
      await exitLottery(currentRoundId);
      setTxSuccess('Successfully exited the lottery!');
      await refreshRoundData();
    } catch (error: any) {
      setTxError(error.message || 'Failed to exit lottery');
    } finally {
      setTxLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!currentRoundId) return;

    setTxLoading(true);
    setTxError(null);
    setTxSuccess(null);

    try {
      await claimWinnings(currentRoundId);
      setTxSuccess('Successfully claimed winnings!');
      await refreshRoundData();
    } catch (error: any) {
      setTxError(error.message || 'Failed to claim winnings');
    } finally {
      setTxLoading(false);
    }
  };

  const formatTimeRemaining = (endTime: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(endTime) - now;
    
    if (remaining <= 0) return 'Round ended';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isWinner = currentRound && address && currentRound.winner.toLowerCase() === address.toLowerCase();
  const hasTicket = userTicket && userTicket.stake > BigInt(0) && !userTicket.exited;

  if (!authenticated) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to participate in the Aave Lottery
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Status */}
      {txError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{txError}</p>
        </div>
      )}
      
      {txSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200 text-sm">{txSuccess}</p>
        </div>
      )}

      {/* Current Round Info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Round #{currentRoundId?.toString() || '...'}
          </h2>
          <button
            onClick={refreshRoundData}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {currentRound ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Pool</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatUnits(currentRound.totalStake, USDC_DECIMALS)} USDC
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4">
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Award</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {formatUnits(currentRound.award, USDC_DECIMALS)} USDC
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Time Remaining</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatTimeRemaining(currentRound.endTime)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading round data...</p>
          </div>
        )}

        {/* Winner Display */}
        {currentRound && currentRound.winner !== '0x0000000000000000000000000000000000000000' && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
              {isWinner ? '🎉 Congratulations! You won!' : 'Winner'}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-mono">
              {currentRound.winner}
            </p>
          </div>
        )}
      </div>

      {/* User Ticket Info */}
      {hasTicket && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Ticket</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Your Stake</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatUnits(userTicket.stake, USDC_DECIMALS)} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ticket Range</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {userTicket.segmentStart.toString()} - {(userTicket.segmentStart + userTicket.stake).toString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleExit}
            disabled={txLoading || userTicket.exited}
            className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {txLoading ? 'Processing...' : userTicket.exited ? 'Already Exited' : 'Exit Lottery'}
          </button>
        </div>
      )}

      {/* Entry Form */}
      {!hasTicket && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Enter Lottery</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount (USDC)
                </label>
                {usdcBalance !== null && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Balance: {formatUnits(usdcBalance, USDC_DECIMALS)} USDC
                  </span>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={entryAmount}
                onChange={(e) => setEntryAmount(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleEnter}
              disabled={txLoading || !entryAmount}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {txLoading ? 'Processing...' : 'Enter Lottery'}
            </button>
          </div>
        </div>
      )}

      {/* Claim Winnings */}
      {isWinner && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl shadow-xl p-6 border-2 border-yellow-400 dark:border-yellow-600">
          <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">
            🎉 You Won!
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            Congratulations! You can now claim your winnings.
          </p>
          <button
            onClick={handleClaim}
            disabled={txLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-yellow-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {txLoading ? 'Processing...' : 'Claim Winnings'}
          </button>
        </div>
      )}

      {/* Round Duration Info */}
      {roundDuration && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Round Duration: {(Number(roundDuration) / 86400).toFixed(1)} days
        </div>
      )}
    </div>
  );
}
