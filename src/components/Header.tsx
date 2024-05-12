import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "@/components/ConnectButton";

export function Header() {
  return (
    <div className="header navbar fixed top-0 z-50 w-full max-w-5xl px-2 py-1 bg-white">
      <div className="flex-1">
        <div className="btn btn-ghost p-0 hidden md:flex">
          <Link href="/" className="relative w-32 h-10">
            <Image fill src="/insights-logo.svg" alt="Insights" priority />
          </Link>
        </div>
        <div className="btn btn-ghost px-1 py-0 md:hidden">
          <Link href="/" className="relative w-6 h-6">
            <Image fill src="/insights-logo-icon.svg" alt="Insights" priority />
          </Link>
        </div>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-0 text-sm items-center">
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              <Image src="/twitter.svg" alt="X" width={20} height={20} priority />
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              <Image src="/discord.svg" alt="Discord" width={20} height={20} priority />
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              <Image src="/docs.svg" alt="Whitepaper" width={20} height={20} priority />
            </Link>
          </li>
        </ul>
        <div className="px-3 md:px-4">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
