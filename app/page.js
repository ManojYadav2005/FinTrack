import React from "react";
import { Button } from "@/components/ui/button";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-root)" }}>
      {/* Hero */}
      <HeroSection />

      {/* ── Stats Section ─────────────────────────────────────── */}
      <section className="py-16 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          {/* SQL header */}
          <div className="text-center mb-10">
            <code className="text-xs text-slate-500 font-mono">
              <span className="sql-keyword">SELECT</span>{" "}
              <span className="sql-string">metric</span>,{" "}
              <span className="sql-string">value</span>{" "}
              <span className="sql-keyword">FROM</span>{" "}
              <span className="text-slate-300">platform_stats</span>
            </code>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, i) => (
              <div
                key={i}
                className="terminal-card p-6 text-center group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-extrabold font-mono mb-2 glow-text-blue group-hover:glow-text-cyan transition-all">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────── */}
      <section id="features" className="py-20 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
              SCHEMA: features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              Everything You Need to{" "}
              <span className="gradient-title">Master Your Money</span>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Built like a database — precise, fast, and always ready to query.
            </p>
          </div>

          {/* SQL Table-style feature list */}
          <div className="terminal-card overflow-hidden max-w-5xl mx-auto">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-700 bg-slate-900/60">
              <div className="col-span-1 text-xs font-mono text-slate-500 uppercase tracking-widest">#</div>
              <div className="col-span-1 text-xs font-mono text-cyan-400 uppercase tracking-widest">icon</div>
              <div className="col-span-3 text-xs font-mono text-cyan-400 uppercase tracking-widest">feature</div>
              <div className="col-span-7 text-xs font-mono text-cyan-400 uppercase tracking-widest">description</div>
            </div>
            {featuresData.map((feature, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors group cursor-default"
              >
                <div className="col-span-1 text-slate-600 font-mono text-sm self-center">{String(i + 1).padStart(2, "0")}</div>
                <div className="col-span-1 self-center">{feature.icon}</div>
                <div className="col-span-3 self-center">
                  <span className="text-slate-100 font-semibold text-sm group-hover:text-blue-400 transition-colors">{feature.title}</span>
                </div>
                <div className="col-span-7 self-center text-slate-400 text-sm leading-relaxed">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-20 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-4">
              PROCEDURE: onboarding
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksData.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < howItWorksData.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%+0px)] w-full h-px bg-gradient-to-r from-slate-600 to-transparent z-0" />
                )}
                <div className="terminal-card p-6 text-center relative z-10 group-hover:border-blue-500/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-all">
                    <span className="text-blue-400">{step.icon}</span>
                  </div>
                  <div className="sql-badge sql-badge-blue mb-3">{step.step}</div>
                  <h3 className="text-slate-100 font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-4">
              SELECT * FROM user_reviews
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonialsData.map((t, i) => (
              <div key={i} className="terminal-card p-6 group hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="rounded-full border-2 border-slate-600 group-hover:border-green-500/50 transition-colors"
                  />
                  <div>
                    <div className="text-slate-100 font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs font-mono">{t.role}</div>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-gradient" style={{ backgroundSize: "200% 200%" }} />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-6">
            INSERT INTO your_journey (start_date) VALUES (NOW())
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of users who track smarter, spend wiser, and grow faster with FinTrack.
          </p>
          <Link href="/dashboard">
            <button className="group px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 text-base animate-pulse-glow">
              Start Free — No Card Needed
              <svg className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
