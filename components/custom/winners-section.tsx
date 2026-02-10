import React from 'react';
import { Trophy, Award } from 'lucide-react';
import { RecentWinner } from '@/lib/types';

interface WinnersSectionProps {
    winners: RecentWinner[];
}

export const WinnersSection: React.FC<WinnersSectionProps> = ({ winners }) => (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-black text-xl flex items-center gap-2.5 text-slate-900 tracking-tight">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                    <Trophy size={20} />
                </div>
                Winners
            </h3>
            <Award className="text-slate-300" size={24} />
        </div>
        <div className="p-2">
            {winners.length > 0 ? winners.map((winner, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
                                {winner.name[0]}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm text-yellow-500">
                                <Trophy size={10} />
                            </div>
                        </div>
                        <div>
                            <p className="font-black text-slate-900 tracking-tight">{winner.name}</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{winner.raffle}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-blue-600 text-lg">+{winner.prize}</p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{winner.date}</p>
                    </div>
                </div>
            )) : (
                <div className="p-12 text-center">
                    <Trophy className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-medium">No winners recorded yet. Be the first!</p>
                </div>
            )}
        </div>
    </div>
);
