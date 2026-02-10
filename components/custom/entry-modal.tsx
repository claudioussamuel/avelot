import React from 'react';
import { X, Trophy, Calendar, Zap, AlertCircle } from 'lucide-react';
import { Raffle } from '@/lib/types';

interface EntryModalProps {
    raffle: Raffle | null;
    onClose: () => void;
    onPurchase: (raffle: Raffle, ticketCount: number) => void;
    onFinalize: (raffleId: number) => void;
    allowance: bigint;
    onApprove: (amount: bigint) => Promise<void>;
    isApproving: boolean;
}

export const EntryModal: React.FC<EntryModalProps> = ({ raffle, onClose, onPurchase, onFinalize, allowance, onApprove, isApproving }) => {
    const [ticketCount, setTicketCount] = React.useState(0.0);

    if (!raffle) return null;

    const isRoundEnded = raffle.endTime && raffle.endTime * 1000 <= Date.now();

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <div className={`h-24 bg-gradient-to-r ${raffle.color} p-6 flex justify-between items-center`}>
                    <h3 className="text-2xl font-black text-white">{raffle.name}</h3>
                    <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Win Potential</p>
                                <p className="text-3xl font-black text-blue-600 tracking-tight">{raffle.prize}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                <Trophy size={24} />
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-200 pt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> Draw Date</span>
                                <span className="font-bold text-slate-900">{raffle.endDate}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5"><Zap size={14} /> Ticket Price</span>
                                <span className="font-bold text-slate-900">No Loss</span>
                            </div>
                        </div>
                    </div>

                    {!isRoundEnded ? (
                        <div className="mb-8">
                            <label className="block text-slate-700 text-sm font-bold mb-3 uppercase tracking-wider">Stake Amount (USDC)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={ticketCount}
                                    onChange={(e) => setTicketCount(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-xl font-black text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">USDC</span>
                            </div>
                            <p className="mt-2 text-slate-400 text-xs text-center italic">Your stake is always returnable. Win rewards without losing principal.</p>
                        </div>
                    ) : (
                        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start">
                            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-900 font-bold text-sm">Draw Ready!</p>
                                <p className="text-amber-700 text-xs">This round has concluded. Finalize to determine the winner and claim rewards.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {!isRoundEnded && (BigInt(Math.floor(ticketCount * 1000000)) > allowance) && (
                            <button
                                onClick={() => onApprove(BigInt(Math.floor(ticketCount * 1000000)))}
                                disabled={isApproving}
                                className="w-full px-6 py-4 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                            >
                                {isApproving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Approving USDC...
                                    </>
                                ) : (
                                    <>
                                        Approve USDC
                                        <Zap size={18} />
                                    </>
                                )}
                            </button>
                        )}
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-200"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => isRoundEnded ? onFinalize(raffle.id) : onPurchase(raffle, ticketCount)}
                                disabled={!isRoundEnded && (BigInt(Math.floor(ticketCount * 1000000)) > allowance)}
                                className={`flex-[2] px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${isRoundEnded
                                    ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 disabled:bg-blue-300 disabled:shadow-none disabled:cursor-not-allowed'
                                    }`}
                            >
                                {isRoundEnded ? 'Finalize Draw' : 'Secure Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
