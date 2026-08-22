import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { Link } from "react-router-dom";
import { updateDefaultAccount } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatCurrency";
import { useQueryClient } from "@tanstack/react-query";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const queryClient = useQueryClient();

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
    if (updatedAccount?.success) {
      toast.success("Default account updated");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to update default account");
  }, [error]);

  return (
    <Link to={`/account/${id}`} className="block">
      <div className="simple-card group relative overflow-hidden cursor-pointer h-full min-h-[160px] p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200">

        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm capitalize">{name}</p>
              <p className="text-xs text-slate-400 capitalize">{type.toLowerCase()} account</p>
            </div>
          </div>
          <div onClick={(e) => e.preventDefault()} className="flex items-center gap-2">
            {isDefault && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold">
                Default
              </span>
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
          <p className="text-xs text-slate-400 mb-1 font-medium">Balance</p>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(parseFloat(balance))}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-600 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
            <span className="text-red-500 font-medium">Expense</span>
          </div>
          <div className="text-xs text-blue-500 font-medium">View →</div>
        </div>
      </div>
    </Link>
  );
}
