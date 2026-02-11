import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, ChevronRight, Zap } from 'lucide-react';
import { Raffle } from '@/lib/types';
import { formatTimeLeft } from '@/lib/raffleUtils';

interface RaffleCardProps {
    raffle: Raffle;
    onEnter: (raffle: Raffle) => void;
    onFinalize?: (raffleId: number) => void;
    onExit?: (raffleId: number) => void;
    userTicket?: any;
    userAddress?: string;
}

export const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onEnter, onFinalize, onExit, userTicket, userAddress }) => {
    const [timeLeft, setTimeLeft] = useState(raffle.timeLeft);
    const isRoundEnded = raffle.endTime && raffle.endTime * 1000 <= Date.now();

    const isWinner = raffle.winner == userAddress;
    const hasParticipated = userTicket && userTicket.stake && userTicket.stake > BigInt(0);
    const hasExited = userTicket && userTicket.exited;
    const hasClaimed = userTicket ? userTicket.claimed : false;
    const remaining = Math.max(0, raffle.endTime - Date.now() / 1000);
    useEffect(() => {
        if (raffle.finalized) {
            setTimeLeft('Ended');
            return;
        }

        const interval = setInterval(() => {
            
            setTimeLeft(formatTimeLeft(remaining));
        }, 1000);

        return () => clearInterval(interval);
    }, [raffle.endTime, raffle.finalized, remaining]);

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className={`relative h-40 bg-gradient-to-br ${raffle.color} p-6 flex flex-col justify-between overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-15 transition-transform group-hover:scale-110 duration-500">
                    <Trophy size={100} />
                </div>

                <div className="relative z-10">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm mb-2 uppercase tracking-wider">
                        {raffle.type}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">{raffle.name}</h3>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                    <div>
                        <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-0.5">Amount Staked</p>
                        <p className="text-3xl font-black text-white tracking-tight">{raffle.entries.toLocaleString()} USDC</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex flex-col">
                        <div className="flex items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                            <Clock size={14} className="mr-1" />
                            Time Left
                        </div>
                        <span className="text-slate-900 font-bold">{timeLeft}</span>
                    </div>
                    {/* <div className="flex flex-col">
                        <div className="flex items-center text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                            <Users size={14} className="mr-1" />
                            Participants
                        </div>
                        <span className="text-slate-900 font-bold">{raffle.entries.toLocaleString()}</span>
                    </div> */}
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-500 font-medium">Ticket Price</span>
                        <span className="font-bold text-slate-900">{raffle.ticketPrice === '$0' ? 'No Loss' : raffle.ticketPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm px-1">
                        <span className="text-slate-500 font-medium">Odds of Winning</span>
                        <span className="font-bold text-slate-900">{raffle.odds}</span>
                    </div>
                </div>

                {raffle.finalized ? (
                    <div className="flex gap-2">
                        {hasParticipated && !hasExited && onExit ? (
                            <button
                                onClick={() => onExit(raffle.id)}
                                className="w-full bg-slate-100 text-slate-500 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2 group/btn"
                            >
                                Exit Raffle
                                <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        ) : (
                            <div className="w-full py-3.5 rounded-xl font-bold text-center text-slate-400 bg-slate-50 border border-slate-100">
                                {isWinner ? 'Winner' : hasExited ? 'Exited' : 'Not Participated'}
                            </div>
                        )}
                    </div>
                ) : isRoundEnded && onFinalize ? (
                    <button
                        onClick={() => onFinalize(raffle.id)}
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group/btn"
                    >
                        Finalize Round
                        <Zap size={18} className="transition-transform group-hover/btn:rotate-12" />
                    </button>
                ) : (
                    <button
                        onClick={() => onEnter(raffle)}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group/btn"
                    >
                        Enter Raffle
                        <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                )}
            </div>
        </div>
    );
};
