"use client"

import React, { useState } from 'react';
import { PlusCircle, Clock, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAaveLottery } from '@/hooks/useAaveLottery';

export const AdminRaffleForm: React.FC = () => {
    const { createRound, loading } = useAaveLottery();
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('3600'); // Default 1 hour in seconds
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !duration) {
            setStatus({ type: 'error', message: 'Please fill in all fields' });
            return;
        }

        setStatus({ type: 'idle', message: '' });

        try {
            await createRound(name, BigInt(duration));
            setStatus({ type: 'success', message: `Raffle "${name}" created successfully!` });
            setName('');
            setDuration('3600');
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to create raffle' });
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 max-w-2xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <PlusCircle size={120} />
            </div>

            <div className="relative z-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create New Raffle</h2>
                    <p className="text-slate-500 font-medium">Configure and launch a new no-loss prize draw.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Tag size={16} className="text-blue-500" />
                            Raffle Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Weekend Special Draw"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            Duration (Seconds)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="3600"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            />
                            <div className="flex items-center gap-2">
                                <select
                                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-700 font-bold focus:outline-none shadow-sm cursor-pointer"
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val)) setDuration(val.toString());
                                    }}
                                    defaultValue="3600"
                                >
                                    <option value="3600">1 Hour</option>
                                    <option value="86400">1 Day</option>
                                    <option value="604800">1 Week</option>
                                    <option value="2592000">30 Days</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 font-medium ml-1">
                            Current setting: {Math.floor(parseInt(duration) / 3600)} hours, {Math.floor((parseInt(duration) % 3600) / 60)} minutes
                        </p>
                    </div>

                    {status.type !== 'idle' && (
                        <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <p className="font-bold text-sm tracking-tight">{status.message}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg tracking-tight transition-all shadow-xl flex items-center justify-center gap-3 ${loading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Launch Raffle
                                <PlusCircle size={22} className="text-blue-400" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
