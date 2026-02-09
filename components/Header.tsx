"use client"

import { usePrivy } from "@privy-io/react-auth"
import Image from "next/image"
import { useViemWithPrivy } from "@/hooks/useViemWithPrivy"
import { base } from "viem/chains"
import { AlertTriangle } from "lucide-react"

export default function Header() {
  const {
    authenticated,
    user,
    login,
    logout,
    chainId,
    switchNetwork
  } = useViemWithPrivy();

  const isWrongNetwork = authenticated && chainId !== base.id;

  const handleAuth = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-zinc-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-row justify-between items-center min-h-[72px]">
        <div className="flex items-center gap-2.5 md:gap-6">
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 transition-transform group-hover:scale-110">
              <Image
                src="/Avelot.png"
                alt="AveLot logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <h1 className="font-extrabold text-2xl hidden md:block tracking-tight text-slate-900">
              AveLot
            </h1>
          </a>
        </div>

        <div className="hidden lg:flex items-center">
          <span className="text-sm font-medium text-slate-500 italic bg-slate-100 px-3 py-1 rounded-full">
            No Loss Raffle Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          {authenticated && isWrongNetwork && (
            <button
              onClick={() => switchNetwork(base.id)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-sm font-bold transition-all animate-pulse"
            >
              <AlertTriangle size={16} />
              Switch to Base
            </button>
          )}

          {authenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-900">Connected</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : ''}
                </span>
              </div>
              <button
                onClick={handleAuth}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-sm font-bold transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuth}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav >
    </header >
  )
}
