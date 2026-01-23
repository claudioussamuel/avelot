import { Raffle } from './types';

const RAFFLE_TYPE_MAP: Record<string, string> = {
  'Weekly Lightning Draw': 'weekly',
  'Monthly Mega Prize': 'monthly',
  'Bi-Monthly Bonanza': 'bimonthly',
  'Quarterly Grand Draw': 'quarterly',
  'Half-Year Jackpot': 'halfyear',
};

const GRADIENT_MAP: Record<string, string> = {
  weekly: 'from-blue-400 to-blue-600',
  monthly: 'from-purple-400 to-purple-600',
  bimonthly: 'from-pink-400 to-pink-600',
  quarterly: 'from-orange-400 to-orange-600',
  halfyear: 'from-green-400 to-green-600',
};

export function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return 'Ended';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function convertToWei(amount: number, decimals: number = 18): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

export function convertFromWei(amount: bigint, decimals: number = 18): number {
  return Number(amount) / Math.pow(10, decimals);
}
