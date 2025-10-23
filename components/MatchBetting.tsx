'use client';

import { useState, useEffect } from 'react';

export default function MatchBetting() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | 'draw' | null>(null);
  const [betAmount, setBetAmount] = useState('');

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

  const matchData = {
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    league: 'Premier League',
    homePool: '45,230',
    awayPool: '38,450',
    drawPool: '12,320',
    totalPool: '96,000',
    homeBettors: 847,
    awayBettors: 692,
    drawBettors: 231
  };

  const totalPool = parseFloat(matchData.totalPool.replace(',', ''));
  const homeOdds = (totalPool / parseFloat(matchData.homePool.replace(',', ''))).toFixed(2);
  const awayOdds = (totalPool / parseFloat(matchData.awayPool.replace(',', ''))).toFixed(2);
  const drawOdds = (totalPool / parseFloat(matchData.drawPool.replace(',', ''))).toFixed(2);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Match Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 text-white">
            {matchData.league} • Live Betting
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Place Your Bet
          </h2>
          <p className="text-slate-200">Kickoff in {timeRemaining.hours}h {timeRemaining.minutes}m</p>
        </div>

        {/* Match Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl md:text-4xl">🔴</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">{matchData.homeTeam}</h3>
              <p className="text-sm text-slate-300">{matchData.homeBettors} bettors</p>
            </div>

            {/* VS */}
            <div className="flex-shrink-0 text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">VS</div>
              <div className="text-sm text-slate-300">
                {timeRemaining.hours.toString().padStart(2, '0')}:
                {timeRemaining.minutes.toString().padStart(2, '0')}:
                {timeRemaining.seconds.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl md:text-4xl">🔴</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">{matchData.awayTeam}</h3>
              <p className="text-sm text-slate-300">{matchData.awayBettors} bettors</p>
            </div>
          </div>
        </div>

        {/* Betting Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Home Win */}
          <button
            onClick={() => setSelectedTeam('home')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedTeam === 'home'
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-1">Home Win</p>
              <p className="text-2xl font-bold text-white mb-2">{homeOdds}x</p>
              <div className="text-xs text-slate-400">
                <p>Pool: {matchData.homePool} USDC</p>
              </div>
            </div>
          </button>

          {/* Draw */}
          <button
            onClick={() => setSelectedTeam('draw')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedTeam === 'draw'
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-1">Draw</p>
              <p className="text-2xl font-bold text-white mb-2">{drawOdds}x</p>
              <div className="text-xs text-slate-400">
                <p>Pool: {matchData.drawPool} USDC</p>
              </div>
            </div>
          </button>

          {/* Away Win */}
          <button
            onClick={() => setSelectedTeam('away')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedTeam === 'away'
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
          >
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-1">Away Win</p>
              <p className="text-2xl font-bold text-white mb-2">{awayOdds}x</p>
              <div className="text-xs text-slate-400">
                <p>Pool: {matchData.awayPool} USDC</p>
              </div>
            </div>
          </button>
        </div>

        {/* Bet Input */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTeam ? `Betting on ${selectedTeam === 'home' ? matchData.homeTeam : selectedTeam === 'away' ? matchData.awayTeam : 'Draw'}` : 'Select Your Prediction'}
              </h3>
              {selectedTeam && (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                  {selectedTeam === 'home' ? homeOdds : selectedTeam === 'away' ? awayOdds : drawOdds}x Returns
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bet Amount (USDC)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              {selectedTeam && betAmount && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Potential Winnings:</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {(parseFloat(betAmount) * parseFloat(selectedTeam === 'home' ? homeOdds : selectedTeam === 'away' ? awayOdds : drawOdds)).toFixed(2)} USDC
                    </span>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedTeam || !betAmount}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
              >
                {!selectedTeam ? 'Select a Team First' : !betAmount ? 'Enter Bet Amount' : 'Place Bet'}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Winners share the total pool proportionally. Your stake is returned if you win.
              </p>
            </div>
          </div>

          {/* Pool Stats */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Prize Pool</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{matchData.totalPool} USDC</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Bettors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{matchData.homeBettors + matchData.awayBettors + matchData.drawBettors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
