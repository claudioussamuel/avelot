'use client';

export default function UserBets() {
  const userBets = [
    { 
      matchId: 1, 
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      amount: '500', 
      prediction: 'home',
      status: 'active', 
      kickoff: '2h 45m',
      potentialWin: '1,250'
    },
    { 
      matchId: 2, 
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      amount: '300', 
      prediction: 'away',
      status: 'ended', 
      result: 'home',
      canClaim: false 
    },
    { 
      matchId: 3, 
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      amount: '250', 
      prediction: 'draw',
      status: 'won', 
      winnings: '875',
      result: 'draw'
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Your Bets Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-slate-100 text-sm mb-1">Total Bet</p>
            <p className="text-3xl font-bold">1,050</p>
            <p className="text-sm text-slate-100 mt-1">USDC</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm mb-1">Active Bets</p>
            <p className="text-3xl font-bold">1</p>
            <p className="text-sm text-blue-100 mt-1">Live Match</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-emerald-100 text-sm mb-1">Total Winnings</p>
            <p className="text-3xl font-bold">875</p>
            <p className="text-sm text-emerald-100 mt-1">USDC</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-amber-100 text-sm mb-1">Win Rate</p>
            <p className="text-3xl font-bold">33%</p>
            <p className="text-sm text-amber-100 mt-1">1 of 3 bets</p>
          </div>
        </div>

        {/* Your Bets */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Betting History</h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {userBets.map((bet) => (
              <div key={bet.matchId} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        bet.status === 'active' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        bet.status === 'won' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {bet.status === 'active' && (
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {bet.status === 'won' && (
                          <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        )}
                        {bet.status === 'ended' && (
                          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {bet.homeTeam} vs {bet.awayTeam}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          bet.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          bet.status === 'won' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {bet.status === 'active' ? 'Live' : bet.status === 'won' ? 'Won!' : 'Lost'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Bet: {bet.amount} USDC</span>
                        <span>•</span>
                        <span className="capitalize">Predicted: {bet.prediction === 'home' ? bet.homeTeam : bet.prediction === 'away' ? bet.awayTeam : 'Draw'}</span>
                        {bet.status === 'active' && (
                          <>
                            <span>•</span>
                            <span>Kickoff in {bet.kickoff}</span>
                          </>
                        )}
                        {bet.status === 'won' && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Won {bet.winnings} USDC</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {bet.status === 'active' && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Potential Win</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{bet.potentialWin} USDC</p>
                      </div>
                    )}
                    {bet.status === 'won' && (
                      <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                        Claim {bet.winnings} USDC
                      </button>
                    )}
                    {bet.status === 'ended' && !bet.canClaim && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Better luck next time</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Betting Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Smart Betting</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Diversify your bets across multiple matches to increase your chances of winning.</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Higher Returns</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Underdogs offer higher multipliers. Check the odds before placing your bet.</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bet Early</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Place bets before kickoff. Pools close when the match starts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
