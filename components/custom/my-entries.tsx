import React from 'react';
import { Raffle, UserEntry } from '@/lib/types';

interface MyEntriesSectionProps {
    entries: UserEntry[];
    raffles: Raffle[];
    onClaim?: (raffleId: number) => void;
    onExit?: (raffleId: number) => void;
}

export const MyEntriesSection: React.FC<MyEntriesSectionProps> = ({ entries, raffles, onClaim, onExit }) => (
    <div className="space-y-4">
        {entries.map(entry => {
            const raffle = raffles.find(r => r.id === entry.raffleId);
            const isFinalized = entry.finalized;
            const isWinner = entry.isWinner;

            return (
                <div key={entry.raffleId} className="bg-white rounded-xl p-4 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-lg">{raffle?.name}</h4>
                            <p className="text-gray-600 text-sm">Prize: {raffle?.prize}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isWinner ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {entry.position}
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                        <div>
                            <p className="text-gray-600 text-sm">Your Tickets</p>
                            <p className="font-bold text-xl">{entry.tickets}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Draw In</p>
                            <p className="font-bold text-xl">{raffle?.timeLeft}</p>
                        </div>
                    </div>

                    {isFinalized && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                            {isWinner ? (
                                <>
                                    <button
                                        onClick={() => onClaim?.(entry.raffleId)}
                                        className="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                                    >
                                        Claim Prize
                                    </button>
                                    <button
                                        onClick={() => onExit?.(entry.raffleId)}
                                        className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                                    >
                                        Exit
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => onExit?.(entry.raffleId)}
                                    className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Exit Raffle
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);
