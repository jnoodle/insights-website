import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="navbar fixed top-0 z-50 w-full max-w-5xl px-2 py-2">
      <div className="flex-1">
        <div className="btn btn-ghost p-0 hidden md:flex">
          <Link href="/" className="relative w-36 h-12">
            <Image fill src="/insights-logo.svg" alt="Ladder" priority />
          </Link>
        </div>
        <div className="btn btn-ghost px-1 py-0 md:hidden">
          <Link href="/" className="relative w-8 h-8">
            <Image fill src="/insights-logo-icon.svg" alt="Ladder" priority />
          </Link>
        </div>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-0 text-base items-center">
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              <Image src="/twitter.svg" alt="X" width={24} height={24} priority />
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              <Image src="/discord.svg" alt="Discord" width={24} height={24} priority />
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              <Image src="/docs.svg" alt="Whitepaper" width={24} height={24} priority />
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank" className="px-3 md:px-4">
              Connect Wallet
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
