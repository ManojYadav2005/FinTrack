import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinTrack — Personal Finance Dashboard",
  description: "Track your spending, manage budgets, and get AI-powered insights. A simple finance dashboard built for everyday use.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={`${inter.className} antialiased bg-white text-slate-900`}>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Toaster
            richColors
            toastOptions={{
              style: {
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              },
            }}
          />
          {/* Footer */}
          <footer className="border-t border-slate-200 py-8 mt-8 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">F</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    Fin<span className="text-blue-600">Track</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Made by{" "}
                  <span className="text-slate-600 font-medium">Manoj Yadav</span>{" "}
                  · &copy; {new Date().getFullYear()} FinTrack
                </p>
                <p className="text-xs text-slate-400">Personal Finance Tracker</p>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
