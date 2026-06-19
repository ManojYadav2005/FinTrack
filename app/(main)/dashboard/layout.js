import { Suspense } from "react";
import DashboardPage from "./page";
import { BarLoader } from "react-spinners";

export default function Layout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-root)" }}>
          <BarLoader width={280} color="#3b82f6" />
          <p className="text-xs font-mono text-slate-500 animate-pulse">
            QUERYING fintrack.transactions...
          </p>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}
