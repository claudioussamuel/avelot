import React from 'react';
import { Trophy } from 'lucide-react';
import { RecentWinner } from '@/lib/types';

interface WinnersSectionProps {
    winners: RecentWinner[];
}

export const WinnersSection: React.FC<WinnersSectionProps> = ({ winners }) => (
    <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center text-black">
            <Trophy className="mr-2 text-yellow-500" size={24} />
            Recent Winners
        </h3>
        {winners.map((winner, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {winner.name[0]}
                    </div>
                    <div>
                        <p className="font-semibold">{winner.name}</p>
                        <p className="text-gray-600 text-sm">{winner.raffle} Draw</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-green-600">{winner.prize}</p>
                    <p className="text-gray-600 text-sm">{winner.date}</p>
                </div>
            </div>
        ))}
    </div>
);
