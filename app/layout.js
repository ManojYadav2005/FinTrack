import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
    <head>
    <link rel="icon" href="/logo-sm.png" sizes="any" />
    </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 border-t border-indigo-100">
  <div className="container mx-auto px-4 text-center">
    <p className="text-lg font-medium text-gray-700">
    Engineered with passion <span className="text-pink-500">⚙️</span> & precision by{" "}
      <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Manoj Yadav
      </span>
    </p>
    <p className="text-sm text-gray-500 mt-2">
      © {new Date().getFullYear()} FinTrack Finance — Empowering Smarter Money Decisions
    </p>
  </div>
</footer>

        </body>
      </html>
    </ClerkProvider>
  );
}
