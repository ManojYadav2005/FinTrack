"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

function FieldLabel({ children }) {
  return (
    <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

export function AddTransactionForm({ accounts, categories, editMode = false, initialData = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = { ...data, amount: parseFloat(data.amount) };
    if (editMode) transactionFn(editId, formData);
    else transactionFn(formData);
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      if (scannedData.amount) setValue("amount", scannedData.amount.toString());
      if (scannedData.date) setValue("date", new Date(scannedData.date));
      if (scannedData.description) setValue("description", scannedData.description);
      if (scannedData.category) setValue("category", scannedData.category);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated!" : "Transaction created!");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="terminal-card overflow-hidden">
      {/* Form header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
        <span className="text-xs font-mono text-slate-500">INSERT INTO</span>
        <span className="text-xs font-mono text-cyan-400">transactions</span>
        <span className="text-xs font-mono text-slate-500">(</span>
        <span className="text-xs font-mono text-blue-400">type, amount, date, category, description</span>
        <span className="text-xs font-mono text-slate-500">)</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

        {/* AI Receipt Scanner */}
        {!editMode && (
          <div>
            <ReceiptScanner onScanComplete={handleScanComplete} />
          </div>
        )}

        {/* Divider */}
        {!editMode && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs font-mono text-slate-600">OR ENTER MANUALLY</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
        )}

        {/* Type */}
        <div>
          <FieldLabel>type</FieldLabel>
          <Select onValueChange={(v) => setValue("type", v)} defaultValue={type}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-blue-500 hover:border-slate-600 transition-colors">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
              <SelectItem value="EXPENSE" className="font-mono text-sm hover:bg-slate-800 text-red-400">
                EXPENSE
              </SelectItem>
              <SelectItem value="INCOME" className="font-mono text-sm hover:bg-slate-800 text-green-400">
                INCOME
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="mt-1 text-xs font-mono text-red-400">{errors.type.message}</p>}
        </div>

        {/* Amount + Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>amount</FieldLabel>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
              className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-600 transition-colors"
            />
            {errors.amount && <p className="mt-1 text-xs font-mono text-red-400">{errors.amount.message}</p>}
          </div>

          <div>
            <FieldLabel>account_id</FieldLabel>
            <Select
              onValueChange={(v) => setValue("accountId", v)}
              defaultValue={getValues("accountId")}
            >
              <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-blue-500 hover:border-slate-600 transition-colors">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id} className="font-mono text-sm hover:bg-slate-800">
                    {a.name} · ${parseFloat(a.balance).toFixed(2)}
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="ghost"
                    className="w-full text-xs font-mono text-blue-400 hover:bg-blue-500/10 mt-1 justify-start"
                  >
                    + INSERT new_account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && <p className="mt-1 text-xs font-mono text-red-400">{errors.accountId.message}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <FieldLabel>category</FieldLabel>
          <Select
            onValueChange={(v) => setValue("category", v)}
            defaultValue={getValues("category")}
          >
            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-blue-500 hover:border-slate-600 transition-colors">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200 max-h-52">
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="font-mono text-sm hover:bg-slate-800">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="mt-1 text-xs font-mono text-red-400">{errors.category.message}</p>}
        </div>

        {/* Date */}
        <div>
          <FieldLabel>date</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full bg-slate-900 border-slate-700 text-left font-mono text-sm hover:bg-slate-800 hover:border-slate-600 focus:ring-1 focus:ring-blue-500 transition-colors",
                  !date && "text-slate-600"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 text-slate-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => setValue("date", d)}
                disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                initialFocus
                className="text-slate-200"
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="mt-1 text-xs font-mono text-red-400">{errors.date.message}</p>}
        </div>

        {/* Description */}
        <div>
          <FieldLabel>description</FieldLabel>
          <Input
            placeholder="Enter transaction description..."
            {...register("description")}
            className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-600 transition-colors"
          />
          {errors.description && <p className="mt-1 text-xs font-mono text-red-400">{errors.description.message}</p>}
        </div>

        {/* Recurring Toggle */}
        <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 transition-colors">
          <div>
            <p className="text-sm font-semibold text-slate-200">Recurring Transaction</p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">SET recurring = true for this entry</p>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(v) => setValue("isRecurring", v)}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Recurring Interval */}
        {isRecurring && (
          <div>
            <FieldLabel>recurring_interval</FieldLabel>
            <Select
              onValueChange={(v) => setValue("recurringInterval", v)}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200 font-mono text-sm focus:ring-1 focus:ring-blue-500 hover:border-slate-600 transition-colors">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                {["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((v) => (
                  <SelectItem key={v} value={v} className="font-mono text-sm hover:bg-slate-800">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="mt-1 text-xs font-mono text-red-400">{errors.recurringInterval.message}</p>
            )}
          </div>
        )}

        {/* Separator */}
        <div className="h-px bg-slate-800" />

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-600 font-mono text-xs transition-all"
          >
            ROLLBACK
          </Button>
          <Button
            type="submit"
            disabled={transactionLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "UPDATING..." : "COMMITTING..."}
              </>
            ) : editMode ? (
              "UPDATE transaction"
            ) : (
              "COMMIT transaction"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
