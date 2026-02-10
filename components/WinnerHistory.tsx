'use client';

export default function WinnerHistory() {
  const winners = [
    {
      roundId: 41,
      winner: '0x742d...4e89',
      prize: '89.50',
      participants: 1247,
      totalStaked: '52,340',
      date: '2 hours ago'
    },
    {
      roundId: 40,
      winner: '0x1a2b...3c4d',
      prize: '76.30',
      participants: 1089,
      totalStaked: '48,920',
      date: '5 hours ago'
    },
    {
      roundId: 39,
      winner: '0x9f8e...7d6c',
      prize: '92.10',
      participants: 1356,
      totalStaked: '56,780',
      date: '8 hours ago'
    },
    {
      roundId: 38,
      winner: '0x5b4a...3e2f',
      prize: '81.75',
      participants: 1198,
      totalStaked: '51,230',
      date: '11 hours ago'
    },
  ];

  return (
    <section id="history" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Recent Winners
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Congratulations to our latest lottery winners!
            </p>
          </div>
          <button className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/20 rounded-lg font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {winners.map((winner) => (
            <div
              key={winner.roundId}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Round #{winner.roundId}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{winner.winner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prize Won</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {winner.prize} USDC
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount Staked</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{winner.totalStaked} USDC</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ended</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{winner.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Platform Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">4,890</p>
              <p className="text-slate-200">Total Rounds</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">$2.4M</p>
              <p className="text-slate-200">Total Prizes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">45,678</p>
              <p className="text-slate-200">Total Players</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">$89M</p>
              <p className="text-slate-200">Total Staked</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
