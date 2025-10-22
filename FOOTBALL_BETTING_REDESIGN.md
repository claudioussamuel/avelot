# Football Betting Pool Redesign

## Overview
Transformed AveLot from a general lottery system to a **football match betting pool** where users bet on match outcomes and winners share the prize pool proportionally.

## New Concept

### How It Works
1. **Match Selection**: Users browse upcoming football matches
2. **Place Bets**: Choose prediction (Home Win, Draw, or Away Win) and bet amount
3. **Pool Formation**: All bets go into a shared pool, divided by prediction type
4. **Match Result**: After the match, the winning outcome is determined
5. **Prize Distribution**: Winners share the total pool proportionally based on their stake

### Example Payout
- **Total Pool**: 10,000 DAI
- **Winning Team Pool**: 4,000 DAI (40% of bettors)
- **Your Bet**: 100 DAI (2.5% of winning pool)
- **Your Winnings**: 250 DAI (2.5% of total pool = 2.5x return)

## Components Created

### 1. MatchBetting.tsx
**Main betting interface** featuring:
- Live match display with team logos and countdown timer
- Three betting options: Home Win, Draw, Away Win
- Real-time odds calculation based on pool distribution
- Bet amount input with potential winnings preview
- Pool statistics (total pool, total bettors)
- Interactive team selection with visual feedback

**Key Features:**
- Dynamic odds display (e.g., 2.13x, 7.79x)
- Green emerald theme for betting actions
- Countdown timer until kickoff
- Pool distribution per outcome
- Disabled state until team selection

### 2. UserBets.tsx
**Personal betting dashboard** showing:
- **Stats Cards**: Total bet, active bets, total winnings, win rate
- **Betting History**: All user bets with status (Active, Won, Lost)
- **Bet Details**: Match info, prediction, amount, potential/actual winnings
- **Quick Actions**: Claim winnings button for won bets
- **Betting Tips**: Smart betting advice cards

**Status Indicators:**
- 🔵 **Active**: Live match, shows potential winnings
- 🟢 **Won**: Claim button available
- ⚫ **Lost**: Better luck message

### 3. MatchResults.tsx
**Past matches and results** featuring:
- **Recent Matches**: Grid of completed matches with scores
- **Result Badges**: Home Win (blue), Away Win (red), Draw (gray)
- **Pool Stats**: Total pool, number of winners, time ended
- **Platform Statistics**: Total matches, pools, bettors, winnings
- **Upcoming Matches**: Preview of next matches with countdown

### 4. HowBettingWorks.tsx
**Educational section** explaining:
- 5-step betting process with icons
- Pool-based betting mechanics
- Aave integration (bets earn interest)
- Fair & transparent on-chain logic
- **Example Calculation**: Detailed payout breakdown
- Key features cards

### 5. Updated Types (lottery.ts)
```typescript
interface Match {
  homeTeam, awayTeam, kickoffTime
  totalPool, homeTeamPool, awayTeamPool, drawPool
  result: 'home' | 'away' | 'draw' | 'pending'
}

interface Bet {
  matchId, amount, prediction
  claimed, potentialWinnings
}
```

## Design Updates

### Color Scheme
- **Primary Action**: Emerald-600 (betting, winning)
- **Active Bets**: Blue-600
- **Won Bets**: Emerald-600
- **Lost Bets**: Gray
- **Background**: Slate-900 with green/emerald/teal blobs

### UI Elements
- **Match Cards**: Team logos, scores, countdown timers
- **Betting Options**: Three cards with odds and pool amounts
- **Selection State**: Emerald border when selected
- **Stats Display**: Score format (2-1), pool amounts, bettor counts

## Navigation Updates

### Header
- **Tagline**: "Football Betting Pool"
- **Links**: Matches, How It Works, Results

### Footer
- **Description**: Betting pool powered by Aave
- **Links**: Updated to match betting context

## Key Features

### 1. Pool-Based Betting
- All bets go into shared pool
- Winners split entire pool proportionally
- Higher returns for underdog predictions
- Transparent pool distribution

### 2. Dynamic Odds
- Calculated as: Total Pool / Outcome Pool
- Updates in real-time as bets come in
- Example: 2.13x, 7.79x returns

### 3. Match Information
- Team names and logos
- League information
- Kickoff countdown
- Live pool statistics

### 4. Bet Tracking
- Active bets with potential winnings
- Historical bets with results
- Win/loss tracking
- Claim functionality for winners

### 5. Aave Integration
- Bets earn interest until match ends
- Increases prize pool
- Same smart contract foundation

## User Flow

### Betting Flow
1. Browse upcoming matches
2. Select match to bet on
3. Choose prediction (Home/Draw/Away)
4. Enter bet amount
5. See potential winnings
6. Place bet (requires wallet connection)

### Claiming Flow
1. Match ends, result determined
2. Check "Your Bets" dashboard
3. See won bets with claim button
4. Click "Claim Winnings"
5. Receive proportional share of pool

## Technical Integration

### Smart Contract Mapping
```solidity
// Original: enter(amount) for lottery
// New: placeBet(matchId, prediction, amount)

// Original: claim(roundId) for lottery winner
// New: claimWinnings(matchId) for bet winners

// Pool calculation:
// winnings = (userBet / winningPool) * totalPool
```

### Data Structure
- Matches replace Rounds
- Bets replace Tickets
- Three pools per match (home/draw/away)
- Result determines winning pool

## Benefits Over Lottery

1. **More Engaging**: Football matches are exciting events
2. **Multiple Outcomes**: Three betting options per match
3. **Skill Element**: Knowledge of teams matters
4. **Frequent Events**: Many matches daily
5. **Clear Results**: Match outcomes are verifiable
6. **Social Aspect**: Bet with friends on same matches

## Future Enhancements

- Live match updates during games
- Multiple leagues (Premier League, La Liga, etc.)
- Parlay bets (multiple matches)
- Live betting during matches
- Team statistics and form
- Betting history analytics
- Social features (leaderboards, chat)

## Files Modified

### Created:
- `components/MatchBetting.tsx`
- `components/UserBets.tsx`
- `components/MatchResults.tsx`
- `components/HowBettingWorks.tsx`

### Updated:
- `types/lottery.ts` → betting types
- `components/Header.tsx` → betting navigation
- `components/Footer.tsx` → betting description
- `app/page.tsx` → new component structure

### Removed (old lottery components):
- `LotteryHero.tsx`
- `UserDashboard.tsx`
- `WinnerHistory.tsx`
- `HowItWorks.tsx`

---

**Result**: Complete transformation from lottery to football betting pool with professional UI, clear betting mechanics, and engaging user experience! ⚽🎯
