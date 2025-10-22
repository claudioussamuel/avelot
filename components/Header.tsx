'use client';

import { useState } from 'react';

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    // Placeholder for wallet connection logic
    setIsConnected(true);
    setAddress('0x1234...5678');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AveLot
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Football Betting Pool</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#matches" className="text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
              Matches
            </a>
            <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
              How It Works
            </a>
            <a href="#results" className="text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
              Results
            </a>
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Connected</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{address}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-gray-100 transition-all duration-200"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
