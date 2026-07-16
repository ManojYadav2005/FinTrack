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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-gradient-to-b from-slate-50 to-white">

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">

        {/* Small label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Personal Finance Tracker
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Take control of{" "}
          <span className="gradient-title">your money</span>
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Track spending, manage budgets, and get AI-powered insights — all in one simple dashboard built for everyday use.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/dashboard">
            <button className="px-8 py-3.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-base">
              Get Started — It&apos;s Free
            </button>
          </Link>
          <a href="#features">
            <button className="px-8 py-3.5 rounded-lg font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors text-base">
              See Features
            </button>
          </a>
        </div>

        {/* Dashboard preview */}
        <div
          className="hero-image-wrapper max-w-5xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div ref={imageRef} className="hero-image">
            {/* Window chrome */}
            <div className="bg-slate-100 border border-slate-200 rounded-t-xl px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-slate-400 text-xs">FinTrack — Dashboard</span>
            </div>
            <div className="relative rounded-b-xl overflow-hidden border border-t-0 border-slate-200 shadow-xl shadow-slate-200/60">
              <Image
                src="/banner.jpeg"
                width={1200}
                height={675}
                alt="FinTrack Dashboard Preview"
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
