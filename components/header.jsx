import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox, Database } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <nav className="container mx-auto px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="font-mono font-bold text-lg text-slate-100 tracking-tight">
            Fin<span className="text-blue-400">Track</span>
            <span className="text-blue-500 animate-blink">_</span>
          </span>
        </Link>

        {/* Nav Links (signed out only) */}
        <div className="hidden md:flex items-center gap-6">
          <SignedOut>
            <a href="#features" className="text-sm text-slate-400 hover:text-blue-400 font-mono transition-colors">
              features
            </a>
            <a href="#testimonials" className="text-sm text-slate-400 hover:text-blue-400 font-mono transition-colors">
              testimonials
            </a>
          </SignedOut>
          <SignedIn>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">connected</span>
            </div>
          </SignedIn>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 font-mono text-xs transition-all"
              >
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                <span className="hidden md:inline">dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-500/30 font-mono text-xs transition-all"
              >
                <PenBox className="w-4 h-4 mr-1.5" />
                <span className="hidden md:inline">add_tx</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-blue-500/60 hover:bg-blue-500/10 font-mono text-xs transition-all"
              >
                login()
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 border-2 border-slate-600 hover:border-blue-500 transition-colors",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
