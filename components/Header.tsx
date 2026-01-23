"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"

export default function Header() {
    return (
        <nav
            className="px-8 py-4.5 border-b-[1px] border-zinc-100 flex flex-row justify-between items-center xl:min-h-[77px]"
            style={{ backgroundColor: "#f7eed8" }}
        >
            <div className="flex items-center gap-2.5 md:gap-6">
                <a href="/" className="flex items-center gap-1 text-zinc-800">
                    <Image
                        src="/Avelot.png"
                        alt="nft marketplace"
                        width={36}
                        height={36}
                    />
                    <h1 className="font-bold text-2xl hidden md:block">AveLot</h1>
                </a>
             
            </div>
            <h3 className="italic text-left hidden text-zinc-500 lg:block">
                No Loss Raffle Platform
            </h3>

            <div className="flex items-center gap-4">
                <ConnectButton />
            </div>
        </nav>
    )
}
