"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAaveLottery } from '@/hooks/useAaveLottery';
import { AdminRaffleForm } from '@/components/custom/AdminRaffleForm';
import Header from '@/components/Header';
import { BottomNav } from '@/components/custom/BottomNav';

export default function AdminPage() {
    const router = useRouter();
    const { address, admin, authenticated, loading } = useAaveLottery();

    const isAdmin = address && admin && address.toLowerCase() === admin.toLowerCase();

    // Protective redirect if not admin after loading
    useEffect(() => {
        if (!loading && authenticated && admin && !isAdmin) {
            // Optional: redirect non-admins
            // router.push('/');
        }
    }, [loading, authenticated, admin, isAdmin, router]);

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
                    >
                        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </button>

                    {isAdmin && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-sm font-bold">
                            <ShieldCheck size={16} />
                            Verified Admin
                        </div>
                    )}
                </div>

                {!authenticated ? (
                    <div className="max-w-2xl mx-auto py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
                        <AlertCircle size={48} className="mx-auto text-slate-300 mb-6" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Wallet Disconnected</h2>
                        <p className="text-slate-500 font-medium mb-8">Please connect your wallet to access the admin panel.</p>
                    </div>
                ) : loading ? (
                    <div className="max-w-2xl mx-auto py-20 text-center">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
                        <p className="text-slate-500 font-bold">Verifying admin status...</p>
                    </div>
                ) : isAdmin ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
                        <div className="mb-10 text-center space-y-3">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Control</h2>
                            <p className="text-slate-500 font-medium">Create and manage raffles on the smart contract.</p>
                        </div>
                        <AdminRaffleForm />
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto py-20 text-center bg-white rounded-3xl border border-rose-100 shadow-sm p-10">
                        <AlertCircle size={48} className="mx-auto text-rose-500 mb-6" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
                        <p className="text-slate-500 font-medium mb-8">Your address is not authorized to access this page.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </div>

            <BottomNav activeTab="admin" setActiveTab={() => { }} isAdmin={!!isAdmin} />
        </div>
    );
}
