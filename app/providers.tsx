"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { baseSepolia, base, sepolia, mainnet, scroll } from "viem/chains"

export function Providers(props: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    // Get Privy app ID from environment variables
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

    // If no Privy app ID is provided, render children without Privy provider
    if (!privyAppId) {
        return (
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        )
    }

    return (
        <PrivyProvider
            config={{
                loginMethods: [
                    "wallet",
                    "email",
                    "github",
                    "twitter",
                    "discord",
                    "google",
                    "linkedin"
                ],
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
                defaultChain: scroll,
                supportedChains: [baseSepolia, base, sepolia, mainnet, scroll],
            }}
            appId={privyAppId}
        >
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </PrivyProvider>
    )
}
