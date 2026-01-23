import React from 'react';
import { Raffle } from '@/lib/types';

interface EntryModalProps {
    raffle: Raffle | null;
    onClose: () => void;
    onPurchase: (raffle: Raffle, ticketCount: number) => void;
    onFinalize: (raffleId: number) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({ raffle, onClose, onPurchase, onFinalize }) => {
    const [ticketCount, setTicketCount] = React.useState(0.0);

    if (!raffle) return null;

    // Check if the round has ended
    const isRoundEnded = raffle.endTime && raffle.endTime * 1000 <= Date.now();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h3 className="text-2xl font-bold mb-4">{raffle.name}</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-600 mb-2">Prize Pool</p>
                    <p className="text-3xl font-bold text-green-600 mb-4">{raffle.prize}</p>
                    <p className="text-gray-600 mb-1">Ticket Price: {raffle.ticketPrice}</p>
                    <p className="text-gray-600">Draw Date: {raffle.endDate}</p>
                </div>

                {!isRoundEnded && (
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-semibold">Amount (USD)</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.3"
                            value={ticketCount}
                            onChange={(e) => setTicketCount(parseFloat(e.target.value) || 0)}
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold text-black focus:border-blue-600 focus:outline-none"
                        />
                    </div>
                )}

                {isRoundEnded && (
                    <div className="mb-4 p-3 bg-red-100 rounded-lg">
                        <p className="text-red-800 font-semibold">This round has ended and is ready to finalize.</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => isRoundEnded ? onFinalize(raffle.id) : onPurchase(raffle, ticketCount)}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                            isRoundEnded
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isRoundEnded ? 'Finalize' : 'Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
};
