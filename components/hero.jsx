"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      if (window.scrollY > 100) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Radial glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 text-center">

        {/* SQL badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-mono mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="sql-keyword">SELECT</span>
          <span className="text-slate-400">*</span>
          <span className="sql-keyword">FROM</span>
          <span className="sql-string">finances</span>
          <span className="sql-keyword">WHERE</span>
          <span className="sql-string">clarity</span>
          <span className="text-slate-400">=</span>
          <span className="sql-number">true</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <span className="block text-slate-100">Your Finances,</span>
          <span className="block gradient-title mt-1">Perfectly Queried.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          A financial command center built for clarity. Track, analyze, and control every rupee with AI-powered insights and real-time dashboards.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link href="/dashboard">
            <button className="group relative px-8 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 text-base">
              <span className="relative z-10 flex items-center gap-2">
                <span>Get Started Free</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </Link>
          <a href="#features">
            <button className="px-8 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-600 hover:border-blue-500/60 hover:text-white hover:bg-blue-500/10 transition-all duration-200 text-base">
              Explore Features
            </button>
          </a>
        </div>

        {/* Dashboard preview */}
        <div className="hero-image-wrapper max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div ref={imageRef} className="hero-image">
            {/* Fake terminal bar */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-t-2xl px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-slate-400 text-xs font-mono">fintrack — dashboard — main</span>
            </div>
            <div className="relative rounded-b-2xl overflow-hidden border border-t-0 border-slate-700 shadow-2xl shadow-blue-500/10">
              <Image
                src="/banner.jpeg"
                width={1200}
                height={675}
                alt="FinTrack Dashboard Preview"
                className="w-full object-cover"
                priority
              />
              {/* Scan line overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
