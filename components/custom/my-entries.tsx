import React from 'react';
import { Raffle, UserEntry } from '@/lib/types';
import { Ticket, Clock, ArrowUpRight, LogOut } from 'lucide-react';

interface MyEntriesSectionProps {
    entries: UserEntry[];
    raffles: Raffle[];
    onClaim?: (raffleId: number) => void;
    onExit?: (raffleId: number) => void;
}

export const MyEntriesSection: React.FC<MyEntriesSectionProps> = ({ entries, raffles, onClaim, onExit }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(entry => {
            const raffle = raffles.find(r => r.id === entry.raffleId);
            const isFinalized = entry.finalized;
            const isWinner = entry.isWinner;

            return (
                <div key={entry.raffleId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isWinner ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                <Ticket size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 leading-tight">{raffle?.name || 'Raffle Entry'}</h4>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{raffle?.prize || 'Prize Pool'}</p>
                            </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isWinner ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {entry.position}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Ticket size={12} strokeWidth={3} /> My Contribution
                            </p>
                            <p className="font-black text-slate-900 text-lg">{entry.tickets} <span className="text-xs text-slate-400 font-bold uppercase">USDC</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                                <Clock size={12} strokeWidth={3} /> Status
                            </p>
                            <p className="font-black text-slate-900 text-lg">{raffle?.timeLeft || 'Ended'}</p>
                        </div>
                    </div>

                    {isFinalized && (
                        <div className="flex gap-3 mt-4">
                            {isWinner ? (
                                <>
                                    <button
                                        onClick={() => onClaim?.(entry.raffleId)}
                                        className="flex-[2] bg-yellow-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center gap-2"
                                    >
                                        Claim Prize
                                        <ArrowUpRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => onExit?.(entry.raffleId)}
                                        className="flex-1 bg-slate-100 text-slate-500 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all border border-slate-200"
                                    >
                                        Exit
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => onExit?.(entry.raffleId)}
                                    className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Withdraw Contribution
                                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);
