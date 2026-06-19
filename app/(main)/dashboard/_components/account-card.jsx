"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard, Layers } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) toast.success("Default account updated");
  }, [updatedAccount]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update default account");
  }, [error]);

  return (
    <Link href={`/account/${id}`} className="block">
      <div className="terminal-card group relative overflow-hidden cursor-pointer h-full min-h-[160px] p-5 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
        {/* Glow accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <CreditCard className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-100 text-sm capitalize">{name}</p>
              <p className="text-xs font-mono text-slate-500">{type.toLowerCase()}_account</p>
            </div>
          </div>
          <div onClick={(e) => e.preventDefault()} className="flex items-center gap-2">
            {isDefault && (
              <span className="sql-badge sql-badge-blue text-[10px]">DEFAULT</span>
            )}
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
              className="data-[state=checked]:bg-blue-600 scale-75"
            />
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className="text-xs font-mono text-slate-500 mb-1">balance</p>
          <p className="text-2xl font-bold font-mono text-slate-100 group-hover:text-blue-300 transition-colors">
            ${parseFloat(balance).toFixed(2)}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400">income</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400">expense</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>view</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
