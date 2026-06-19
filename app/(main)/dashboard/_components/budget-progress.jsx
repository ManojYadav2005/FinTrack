"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, AlertTriangle, Bell } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { updateBudget } from "@/actions/budget";
import { sendBudgetAlertEmail } from "@/actions/budget-alert";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");
  const [budgetAmount, setBudgetAmount] = useState(initialBudget?.amount || 0);
  const [alertSent, setAlertSent] = useState(false);

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = budgetAmount ? (currentExpenses / budgetAmount) * 100 : 0;
  const isOver80 = percentUsed >= 80;
  const isOver90 = percentUsed >= 90;

  const progressColor = isOver90
    ? "bg-gradient-to-r from-red-500 to-rose-600"
    : isOver80
    ? "bg-gradient-to-r from-amber-400 to-orange-500"
    : "bg-gradient-to-r from-green-400 to-emerald-500";

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(budgetAmount.toString());
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      const newAmount = updatedBudget.data.amount;
      setBudgetAmount(newAmount);
      setIsEditing(false);
      toast.success("Budget updated successfully");

      // Trigger email alert if ≥ 80%
      const pct = (currentExpenses / newAmount) * 100;
      if (pct >= 80 && !alertSent) {
        sendBudgetAlertEmail({
          budgetAmount: newAmount,
          currentExpenses,
          percentageUsed: pct,
        }).then((res) => {
          if (res?.success) {
            setAlertSent(true);
            toast.warning("⚠️ Budget alert email sent!");
          }
        });
      }
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update budget");
  }, [error]);

  // Also trigger on mount if already over 80
  useEffect(() => {
    if (isOver80 && budgetAmount > 0 && !alertSent) {
      setAlertSent(true); // mark so we don't re-trigger on re-render
    }
  }, []);

  return (
    <div className="terminal-card overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">TABLE:</span>
          <span className="text-xs font-mono text-cyan-400">monthly_budget</span>
          {isOver80 && (
            <span className="ml-2 sql-badge sql-badge-red flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {percentUsed.toFixed(0)}% USED
            </span>
          )}
        </div>

        {/* Edit controls */}
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-28 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Amount"
              autoFocus
              disabled={isLoading}
            />
            <button
              onClick={handleUpdateBudget}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-green-500/10 border border-transparent hover:border-green-500/30 transition-all"
            >
              <Check className="w-4 h-4 text-green-400" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg hover:bg-slate-700 border border-transparent hover:border-slate-600 transition-all group"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Alert banner at 80%+ */}
        {isOver80 && budgetAmount > 0 && (
          <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
            isOver90
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            <Bell className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">
                {isOver90 ? "Critical: " : "Warning: "}
              </span>
              You&apos;ve used{" "}
              <span className="font-mono font-bold">{percentUsed.toFixed(1)}%</span>{" "}
              of your monthly budget.{" "}
              {!isOver90 && "Consider reducing expenses."}
              {isOver90 && "Budget almost exhausted!"}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <p className="text-xs font-mono text-slate-500 mb-1">budget</p>
            <p className="text-lg font-bold font-mono text-slate-100">
              {budgetAmount ? `$${budgetAmount.toFixed(2)}` : <span className="text-slate-600 text-sm">not set</span>}
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <p className="text-xs font-mono text-slate-500 mb-1">spent</p>
            <p className={`text-lg font-bold font-mono ${isOver90 ? "text-red-400" : isOver80 ? "text-amber-400" : "text-slate-100"}`}>
              ${currentExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <p className="text-xs font-mono text-slate-500 mb-1">remaining</p>
            <p className={`text-lg font-bold font-mono ${budgetAmount - currentExpenses < 0 ? "text-red-400" : "text-green-400"}`}>
              {budgetAmount ? `$${Math.max(0, budgetAmount - currentExpenses).toFixed(2)}` : "—"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {budgetAmount > 0 && (
          <div className="space-y-2">
            <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
              {/* Threshold markers */}
              <div className="absolute top-0 bottom-0 border-l border-dashed border-amber-500/60" style={{ left: "80%" }} />
              <div className="absolute top-0 bottom-0 border-l border-dashed border-red-500/60" style={{ left: "90%" }} />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-500">
              <span>0%</span>
              <span className={isOver80 ? (isOver90 ? "text-red-400" : "text-amber-400") : "text-slate-400"}>
                {percentUsed.toFixed(1)}% used
              </span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
