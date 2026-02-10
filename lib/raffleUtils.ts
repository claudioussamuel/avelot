import { useEffect, useRef } from 'react';
import { Raffle } from './types';

export function formatTimeLeft(seconds: number): string {
    if (seconds <= 0) return 'Ended';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export function useRealTimeCountdown(raffles: Raffle[], setRaffles: (raffles: Raffle[]) => void) {
    const rafflesRef = useRef(raffles);
    rafflesRef.current = raffles;

    useEffect(() => {
        const interval = setInterval(() => {
            setRaffles(rafflesRef.current.map(raffle => ({
                ...raffle,
                timeLeft: raffle.finalized ? 'Ended' : formatTimeLeft(Math.max(0, raffle.endTime - Date.now() / 1000))
            })));
        }, 1000);

        return () => clearInterval(interval);
    }, [setRaffles]);
}

export function convertToWei(amount: number, decimals: number = 18): bigint {
    return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

export function convertFromWei(amount: bigint, decimals: number = 18): number {
    return Number(amount) / Math.pow(10, decimals);
}
