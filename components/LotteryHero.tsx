'use client';

import { useState, useEffect } from 'react';
import { useAaveLottery } from '@/hooks/useAaveLottery';
import { formatUnits } from 'viem';

const USDC_DECIMALS = 6;

export default function LotteryHero() {
  const { currentRound, currentRoundId } = useAaveLottery();
  
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate approximate number of participants
  // Since totalStake is the sum of all stakes, we can estimate participants
  // by dividing by an average stake (this is an approximation)
  const estimatedParticipants = currentRound 
    ? Math.max(1, Math.floor(Number(formatUnits(currentRound.totalStake, USDC_DECIMALS)) / 10))
    : 0;

  // Calculate time remaining from blockchain endTime
  useEffect(() => {
    if (!currentRound) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = Number(currentRound.endTime);
      const remaining = endTime - now;

      if (remaining <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setTimeRemaining({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [currentRound]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side - Info */}
          <div className="flex-1 text-white">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              Round #{currentRoundId?.toString() || '...'} • Active
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Current Prize Pool
            </h2>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-6xl md:text-7xl font-bold">
                {currentRound ? formatUnits(currentRound.award, USDC_DECIMALS) : '...'}
              </span>
              <span className="text-3xl font-semibold text-slate-200">USDC</span>
            </div>
            <p className="text-lg text-slate-100 mb-8 max-w-xl">
              Deposit USDC to enter the lottery. Your deposit earns interest on Aave, and the interest becomes the prize pool. Winner takes all interest, everyone else gets their deposit back!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-slate-200 text-sm mb-1">Total Participants</p>
                <p className="text-2xl font-bold">
                  {currentRound && currentRound.totalStake > BigInt(0) ? estimatedParticipants : '0'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-slate-200 text-sm mb-1">Total Staked</p>
                <p className="text-2xl font-bold">
                  {currentRound ? formatUnits(currentRound.totalStake, USDC_DECIMALS) : '0'} USDC
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Timer */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Round Ends In
              </h3>
              
              {/* Countdown Timer */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-white">{timeRemaining.hours.toString().padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Hours</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-white">{timeRemaining.minutes.toString().padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Minutes</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-white">{timeRemaining.seconds.toString().padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Seconds</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Connect your wallet below to enter the lottery
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Your deposit is safe. Withdraw anytime after round ends.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
