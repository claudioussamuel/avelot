'use client';

import { useState, useEffect } from 'react';

export default function LotteryHero() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
              Round #42 • Active
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Current Prize Pool
            </h2>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-6xl md:text-7xl font-bold">125.50</span>
              <span className="text-3xl font-semibold text-slate-200">DAI</span>
            </div>
            <p className="text-lg text-slate-100 mb-8 max-w-xl">
              Deposit DAI to enter the lottery. Your deposit earns interest on Aave, and the interest becomes the prize pool. Winner takes all interest, everyone else gets their deposit back!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-slate-200 text-sm mb-1">Total Participants</p>
                <p className="text-2xl font-bold">847</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-slate-200 text-sm mb-1">Total Staked</p>
                <p className="text-2xl font-bold">45,230 DAI</p>
              </div>
            </div>
          </div>

          {/* Right Side - Timer & Action */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Round Ends In
              </h3>
              
              {/* Countdown Timer */}
              <div className="flex justify-center gap-4 mb-8">
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

              {/* Entry Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Amount (DAI)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg transition-all duration-200">
                  Enter Lottery
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Your deposit is safe. You can withdraw anytime after the round ends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
