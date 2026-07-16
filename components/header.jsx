import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox, TrendingUp } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800">
            Fin<span className="text-blue-600">Track</span>
          </span>
        </Link>

        {/* Nav Links (signed out only) */}
        <div className="hidden md:flex items-center gap-6">
          <SignedOut>
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              Reviews
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm transition-all"
              >
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm transition-all"
              >
                <PenBox className="w-4 h-4 mr-1.5" />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 text-sm transition-all"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
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
