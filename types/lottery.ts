export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  kickoffTime: number;
  totalPool: string;
  homeTeamPool: string;
  awayTeamPool: string;
  drawPool: string;
  result: 'home' | 'away' | 'draw' | 'pending';
  isActive: boolean;
  league: string;
}

export interface Bet {
  matchId: number;
  amount: string;
  prediction: 'home' | 'away' | 'draw';
  claimed: boolean;
  potentialWinnings?: string;
}

export interface UserStats {
  totalBet: string;
  activeBets: number;
  wonBets: number;
  totalWinnings: string;
}

export interface BettingStats {
  currentMatches: number;
  totalBettors: number;
  currentPrizePool: string;
  timeUntilKickoff: number;
}
