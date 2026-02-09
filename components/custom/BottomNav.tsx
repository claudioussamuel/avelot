"use client"

import React from 'react';
import { Gift, Trophy, Calendar, Users, LucideIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface Tab {
    id: string;
    icon: LucideIcon;
    label: string;
}

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (id: string) => void;
    isAdmin?: boolean;
}

const tabs: Tab[] = [
    { id: 'home', icon: Gift, label: 'Home' },
    { id: 'raffles', icon: Trophy, label: 'Raffles' },
    { id: 'winners', icon: Trophy, label: 'Winners' },
    { id: 'schedule', icon: Calendar, label: 'Dates' },
    { id: 'support', icon: Users, label: 'Support' }
];

const adminTab: Tab = { id: 'admin', icon: PlusCircle, label: 'Admin' };

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isAdmin }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleTabClick = (tabId: string) => {
        if (tabId === 'admin') {
            router.push('/admin');
        } else {
            if (pathname !== '/') {
                router.push('/');
            }
            setActiveTab(tabId);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-40">
            <div className="glass-card rounded-2xl px-6 py-3 flex justify-around items-center gap-1">
                {[...tabs, ...(isAdmin ? [adminTab] : [])].map(tab => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-blue-50 rounded-xl -z-10 animate-in zoom-in-75 duration-300" />
                            )}
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
