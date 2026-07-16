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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* ── Stats Section ─────────────────────────────────────── */}
      <section className="py-16 border-y border-slate-100 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, i) => (
              <div key={i} className="text-center py-6">
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────── */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Everything you need to{" "}
              <span className="gradient-title">manage your money</span>
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto text-lg">
              Simple tools that actually help you understand where your money goes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {featuresData.map((feature, i) => (
              <div
                key={i}
                className="simple-card p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-xl group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-slate-900 font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksData.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < howItWorksData.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+0px)] w-full h-px bg-slate-200 z-0" />
                )}
                <div className="simple-card p-6 text-center relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-2xl group-hover:bg-blue-100 transition-colors">
                    {step.icon}
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium mb-4">
              Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What our users say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonialsData.map((t, i) => (
              <div key={i} className="simple-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="rounded-full border border-slate-200"
                  />
                  <div>
                    <div className="text-slate-900 font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of users who track smarter, spend wiser, and save more with FinTrack.
          </p>
          <Link href="/dashboard">
            <button className="px-10 py-4 rounded-lg font-semibold text-blue-600 bg-white hover:bg-blue-50 transition-colors text-base shadow-sm">
              Start for Free — No Card Needed
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
