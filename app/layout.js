import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinTrack — Smart Finance Dashboard",
  description: "Query your finances. Track every rupee with AI-powered insights, real-time dashboards, and smart budgeting.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className} antialiased`} style={{ background: "var(--bg-root)", color: "var(--text-primary)" }}>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Toaster
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: "#0d1323",
                border: "1px solid #263045",
                color: "#e2e8f0",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "13px",
              },
            }}
          />
          {/* Footer */}
          <footer className="border-t border-slate-800 py-8 mt-8" style={{ background: "var(--bg-surface)" }}>
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold font-mono">F</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-300">
                    Fin<span className="text-blue-400">Track</span>_
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 text-center">
                  CRAFTED BY{" "}
                  <span className="text-blue-400">Manoj Yadav</span>{" "}
                  <span className="text-slate-600">·</span>{" "}
                  &copy; {new Date().getFullYear()} FinTrack
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-slate-500">system operational</span>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
