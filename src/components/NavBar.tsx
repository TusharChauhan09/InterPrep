"use client";

import { ThemeToggle } from "./ThemeToggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import DashboardBtn from "./DashboardBtn";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-all">
      <div className="flex h-14 items-center justify-between px-6 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg tracking-[0.15em] uppercase font-bold hover-border-animate pb-0.5"
          style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
        >
          INTERPREP
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <DashboardBtn />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button
                className="h-9 px-5 text-xs font-bold uppercase tracking-[0.1em] bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
