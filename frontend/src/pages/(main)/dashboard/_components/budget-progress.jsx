"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, AlertTriangle, Bell } from "lucide-react";
import useFetch from "@/frontend/hooks/use-fetch";
import { toast } from "sonner";
import { updateBudget } from "@/backend/actions/budget";
import { sendBudgetAlertEmail } from "@/backend/actions/budget-alert";
import { formatCurrency } from "@/backend/lib/formatCurrency";

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
    ? "bg-red-500"
    : isOver80
    ? "bg-amber-400"
    : "bg-blue-500";

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

  useEffect(() => {
    if (isOver80 && budgetAmount > 0 && !alertSent) {
      setAlertSent(true);
    }
  }, []);

  return (
    <div className="simple-card overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Monthly Budget</span>
          {isOver80 && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              isOver90 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            }`}>
              <AlertTriangle className="w-3 h-3" />
              {percentUsed.toFixed(0)}% used
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
              className="w-28 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Amount"
              autoFocus
              disabled={isLoading}
            />
            <button
              onClick={handleUpdateBudget}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-300 transition-all"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-300 transition-all"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 border border-transparent transition-all group"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Alert banner at 80%+ */}
        {isOver80 && budgetAmount > 0 && (
          <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
            isOver90
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}>
            <Bell className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">
                {isOver90 ? "Critical: " : "Warning: "}
              </span>
              You&apos;ve used{" "}
              <span className="font-bold">{percentUsed.toFixed(1)}%</span>{" "}
              of your monthly budget.{" "}
              {!isOver90 && "Consider reducing expenses."}
              {isOver90 && "Budget almost exhausted!"}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1 font-medium">Budget</p>
            <p className="text-lg font-bold text-slate-800">
              {budgetAmount ? formatCurrency(budgetAmount) : <span className="text-slate-400 text-sm">Not set</span>}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1 font-medium">Spent</p>
            <p className={`text-lg font-bold ${isOver90 ? "text-red-500" : isOver80 ? "text-amber-500" : "text-slate-800"}`}>
              {formatCurrency(currentExpenses)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1 font-medium">Remaining</p>
            <p className={`text-lg font-bold ${budgetAmount - currentExpenses < 0 ? "text-red-500" : "text-green-600"}`}>
              {budgetAmount ? formatCurrency(Math.max(0, budgetAmount - currentExpenses)) : "—"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {budgetAmount > 0 && (
          <div className="space-y-2">
            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>0%</span>
              <span className={isOver80 ? (isOver90 ? "text-red-500 font-semibold" : "text-amber-500 font-semibold") : "text-slate-500"}>
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
