import { useState, useEffect } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/formatCurrency";
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
import { createTransaction, updateTransaction } from "@/lib/api";

function FieldLabel({ children }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
    </label>
  );
}

export function AddTransactionForm({ accounts, categories, editMode = false, initialData = null }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [type, setType] = useState(editMode && initialData ? initialData.type : "EXPENSE");
  const [amount, setAmount] = useState(editMode && initialData ? initialData.amount.toString() : "");
  const [description, setDescription] = useState(editMode && initialData ? initialData.description : "");
  const [accountId, setAccountId] = useState(editMode && initialData ? initialData.accountId : (accounts.find((ac) => ac.isDefault)?.id || ""));
  const [category, setCategory] = useState(editMode && initialData ? initialData.category : "");
  const [date, setDate] = useState(editMode && initialData ? new Date(initialData.date) : new Date());
  const [isRecurring, setIsRecurring] = useState(editMode && initialData ? initialData.isRecurring : false);
  const [recurringInterval, setRecurringInterval] = useState(editMode && initialData?.recurringInterval ? initialData.recurringInterval : "");
  const [errors, setErrors] = useState({});

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? (data) => updateTransaction(editId, data) : createTransaction);

  const validateForm = () => {
    const newErrors = {};
    if (!type) newErrors.type = "Type is required";
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) newErrors.amount = "Valid amount greater than 0 is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!accountId) newErrors.accountId = "Account is required";
    if (!category) newErrors.category = "Category is required";
    if (!date) newErrors.date = "Date is required";
    if (isRecurring && !recurringInterval) newErrors.recurringInterval = "Recurring interval is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
      type,
      amount: parseFloat(amount),
      description,
      accountId,
      category,
      date,
      isRecurring,
      ...(isRecurring && recurringInterval ? { recurringInterval } : {}),
    };

    transactionFn(formData);
  };

  const resetForm = () => {
    setType("EXPENSE");
    setAmount("");
    setDescription("");
    setAccountId(accounts.find((ac) => ac.isDefault)?.id || "");
    setCategory("");
    setDate(new Date());
    setIsRecurring(false);
    setRecurringInterval("");
    setErrors({});
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated!" : "Transaction created!");
      resetForm();
      navigate(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="simple-card overflow-hidden">
      <form onSubmit={onSubmit} className="p-6 space-y-5">

        {/* Type */}
        <div>
          <FieldLabel>Type</FieldLabel>
          <Select onValueChange={setType} value={type}>
            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-sm focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-800">
              <SelectItem value="EXPENSE" className="text-sm text-red-600 font-medium">Expense</SelectItem>
              <SelectItem value="INCOME" className="text-sm text-green-600 font-medium">Income</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
        </div>

        {/* Amount + Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Amount</FieldLabel>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <FieldLabel>Account</FieldLabel>
            <Select onValueChange={setAccountId} value={accountId}>
              <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-sm focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-800">
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id} className="text-sm">
                    {a.name} · {formatCurrency(parseFloat(a.balance))}
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-blue-600 hover:bg-blue-50 mt-1 justify-start"
                  >
                    + Add new account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && <p className="mt-1 text-xs text-red-500">{errors.accountId}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <FieldLabel>Category</FieldLabel>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-sm focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-800 max-h-52">
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-sm">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>

        {/* Date */}
        <div>
          <FieldLabel>Date</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full bg-white border-slate-300 text-slate-800 text-left font-normal text-sm hover:bg-slate-50",
                  !date && "text-slate-400"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-slate-200" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => { if (d) setDate(d); }}
                disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                initialFocus
                className="text-slate-800"
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>

        {/* Description */}
        <div>
          <FieldLabel>Description</FieldLabel>
          <Input
            placeholder="Enter transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Recurring Toggle */}
        <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <div>
            <p className="text-sm font-semibold text-slate-800">Recurring Transaction</p>
            <p className="text-xs text-slate-400 mt-0.5">Repeat this transaction automatically</p>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Recurring Interval */}
        {isRecurring && (
          <div>
            <FieldLabel>Repeat every</FieldLabel>
            <Select onValueChange={setRecurringInterval} value={recurringInterval}>
              <SelectTrigger className="bg-white border-slate-300 text-slate-800 text-sm focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-800">
                {[
                  { value: "DAILY", label: "Daily" },
                  { value: "WEEKLY", label: "Weekly" },
                  { value: "MONTHLY", label: "Monthly" },
                  { value: "YEARLY", label: "Yearly" },
                ].map((v) => (
                  <SelectItem key={v.value} value={v.value} className="text-sm">{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="mt-1 text-xs text-red-500">{errors.recurringInterval}</p>
            )}
          </div>
        )}

        <div className="h-px bg-slate-200" />

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-slate-300 text-slate-600 hover:bg-slate-50 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={transactionLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
          >
            {transactionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editMode ? "Saving..." : "Adding..."}
              </>
            ) : editMode ? (
              "Save Changes"
            ) : (
              "Add Transaction"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
