import React from 'react';
import { X, Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeposit: (amount: number) => void;
    currentBalance: number;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit, currentBalance }) => {
    const [amount, setAmount] = React.useState('');

    if (!isOpen) return null;

    const quickAmounts = [25, 50, 100, 250, 500, 1000];

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <Wallet size={18} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Deposit Funds</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg mb-8 relative overflow-hidden group">
                        <Wallet className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500" size={100} />
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                        <p className="text-4xl font-black tracking-tight">${currentBalance.toFixed(2)}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-700 text-xs font-bold mb-3 uppercase tracking-wider">Stake Amount (USDC)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                min="10"
                                step="10"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-10 pr-5 py-4 text-xl font-black text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 mb-8">
                        {quickAmounts.map((q) => (
                            <button
                                key={q}
                                onClick={() => setAmount(q.toString())}
                                className={`py-2.5 rounded-xl font-bold text-xs transition-all ${amount === q.toString() ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                            >
                                ${q}
                            </button>
                        ))}
                    </div>

                    <div className="mb-8 space-y-3">
                        <label className="block text-slate-700 text-xs font-bold mb-1 uppercase tracking-wider">Funding Method</label>
                        <div className="p-4 border-2 border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-slate-200 rounded animate-pulse" />
                                <span className="font-bold text-slate-900">Digital Wallet</span>
                            </div>
                            <ShieldCheck size={18} className="text-green-500" />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onDeposit(Number(amount))}
                            disabled={!amount}
                            className="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                        >
                            Complete Deposit
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
