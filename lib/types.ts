export interface Raffle {
    id: number;
    name: string;
    type: string;
    prize: string;
    entries: number;
    timeLeft: string;
    endDate: string;
    endTime: number;
    ticketPrice: string;
    odds: string;
    color: string;
    finalized?: boolean;
    winner?: string;
    winnerTicket?: number;
}

export interface UserEntry {
    raffleId: number;
    tickets: number;
    position: string;
    isWinner?: boolean;
    finalized?: boolean;
}

export interface RecentWinner {
    name: string;
    raffle: string;
    prize: string;
    date: string;
}
