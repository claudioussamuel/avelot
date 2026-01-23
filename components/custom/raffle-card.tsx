import React from 'react';
import { Trophy, Clock, Users, ChevronRight } from 'lucide-react';
import { Raffle } from '@/lib/types';

interface RaffleCardProps {
    raffle: Raffle;
    onEnter: (raffle: Raffle) => void;
    onFinalize?: (raffleId: number) => void;
}

export const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onEnter, onFinalize }) => {
    const isRoundEnded = raffle.endTime && raffle.endTime * 1000 <= Date.now();

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className={`h-32 bg-gradient-to-r ${raffle.color} p-4 flex items-center justify-between`}>
                <div className="text-white">
                    <h3 className="text-xl font-bold">{raffle.name}</h3>
                    <p className="text-2xl font-bold mt-2">{raffle.prize}</p>
                </div>
                <Trophy className="text-white opacity-30" size={64} />
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Clock size={16} className="mr-1" />
                        <span>{raffle.timeLeft}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Users size={16} className="mr-1" />
                        <span>{raffle.entries.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Ticket Price:</span>
                        <span className="font-semibold">{raffle.ticketPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Draw Date:</span>
                        <span className="font-semibold">{raffle.endDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Your Odds:</span>
                        <span className="font-semibold">{raffle.odds}</span>
                    </div>
                </div>

                {isRoundEnded && onFinalize ? (
                    <button
                        onClick={() => onFinalize(raffle.id)}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                        Finalize
                        <ChevronRight size={20} className="ml-1" />
                    </button>
                ) : (
                    <button
                        onClick={() => onEnter(raffle)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        Enter Raffle
                        <ChevronRight size={20} className="ml-1" />
                    </button>
                )}
            </div>
        </div>
    );
};
