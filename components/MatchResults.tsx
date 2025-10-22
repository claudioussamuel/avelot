'use client';

export default function MatchResults() {
  const pastMatches = [
    {
      id: 1,
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      result: 'home',
      totalPool: '125,430',
      winningPool: '52,180',
      winners: 847,
      date: '2 hours ago',
      league: 'Premier League'
    },
    {
      id: 2,
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      homeScore: 1,
      awayScore: 1,
      result: 'draw',
      totalPool: '198,560',
      winningPool: '28,340',
      winners: 423,
      date: '1 day ago',
      league: 'La Liga'
    },
    {
      id: 3,
      homeTeam: 'Bayern Munich',
      awayTeam: 'Dortmund',
      homeScore: 3,
      awayScore: 2,
      result: 'home',
      totalPool: '156,780',
      winningPool: '68,920',
      winners: 1089,
      date: '2 days ago',
      league: 'Bundesliga'
    },
    {
      id: 4,
      homeTeam: 'PSG',
      awayTeam: 'Marseille',
      homeScore: 0,
      awayScore: 2,
      result: 'away',
      totalPool: '89,240',
      winningPool: '31,450',
      winners: 567,
      date: '3 days ago',
      league: 'Ligue 1'
    },
  ];

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'home':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">Home Win</span>;
      case 'away':
        return <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">Away Win</span>;
      case 'draw':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs font-medium">Draw</span>;
      default:
        return null;
    }
  };

  return (
    <section id="results" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Recent Match Results
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check out the latest match outcomes and winning bettors!
            </p>
          </div>
          <button className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/20 rounded-lg font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pastMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              {/* Match Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{match.league}</span>
                {getResultBadge(match.result)}
              </div>

              {/* Teams and Score */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚽</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{match.homeTeam}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚽</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{match.awayTeam}</span>
                  </div>
                </div>

                <div className="text-center px-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {match.homeScore}
                  </div>
                  <div className="text-2xl font-bold text-gray-400 my-1">-</div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {match.awayScore}
                  </div>
                </div>
              </div>

              {/* Pool Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pool</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{match.totalPool} DAI</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Winners</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{match.winners} bettors</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ended</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{match.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Statistics */}
        <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Platform Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">2,847</p>
              <p className="text-slate-200">Total Matches</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">$8.4M</p>
              <p className="text-slate-200">Total Pools</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">125,678</p>
              <p className="text-slate-200">Total Bettors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">$6.2M</p>
              <p className="text-slate-200">Total Winnings</p>
            </div>
          </div>
        </div>

        {/* Live Matches */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { home: 'Man City', away: 'Tottenham', time: '3h 20m', league: 'Premier League' },
              { home: 'Inter Milan', away: 'AC Milan', time: '5h 45m', league: 'Serie A' },
              { home: 'Atletico', away: 'Sevilla', time: '8h 10m', league: 'La Liga' },
            ].map((match, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-900/30">
                <div className="text-center mb-4">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                    {match.league}
                  </span>
                </div>
                <div className="text-center mb-4">
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{match.home}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">vs</p>
                  <p className="font-bold text-gray-900 dark:text-white">{match.away}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Starts in</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{match.time}</p>
                </div>
                <button className="w-full mt-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Place Bet
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
