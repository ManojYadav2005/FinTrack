// 1 time change
// correct code version 1

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
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

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
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
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) setValue("description", scannedData.description);
      if (scannedData.category) setValue("category", scannedData.category);
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const filteredCategories = categories.filter((category) => category.type === type);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-300 text-slate-900"

>
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type */}
      <div className="space-y-2">
      <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">
  Type
</label>

        <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
          <SelectTrigger className="space-y-6 bg-gradient-to-br from-sky-50 via-cyan-100 to-blue-100 text-slate-900">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="space-y-6 bg-gradient-to-br from-indigo-50 via-blue-100/80 to-purple-50/80 backdrop-blur-xl text-slate-900 shadow-lg rounded-2xl">
            <SelectItem value="EXPENSE">💸 Expense</SelectItem>
            <SelectItem value="INCOME">💰 Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-400">{errors.type.message}</p>}
      </div>

      {/* Amount + Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400"
          />
          {errors.amount && <p className="text-sm text-red-400">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Account</label>
          <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
            <SelectTrigger className="bg-slate-800/60 border-slate-700 focus:ring-2 focus:ring-orange-400">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  🏦 {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold mt-2 hover:scale-105 transition-transform"
                >
                  + Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && <p className="text-sm text-red-400">{errors.accountId.message}</p>}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Category</label>
        <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
          <SelectTrigger className="bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-300 text-slate-900 focus:ring-2 focus:ring-indigo-400">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border-indigo-200 shadow-lg">

            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                🗂️ {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full bg-slate-800/60 border-slate-700 text-slate-100 hover:bg-slate-700/70 transition",
                !date && "text-slate-400"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-sm text-red-400">{errors.date.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Description</label>
        <Input
          placeholder="Enter description"
          {...register("description")}
          className="bg-slate-800/6 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400"
        />
        {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
      </div>

      {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 transition">
        <div className="space-y-0.5">
          <label className="text-base font-semibold text-slate-11">Recurring Transaction</label>
          <div className="text-sm text-slate-40">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="bg-slate-800/60 border-slate-700 focus:ring-2 focus:ring-orange-400">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="DAILY">📆 Daily</SelectItem>
              <SelectItem value="WEEKLY">🗓️ Weekly</SelectItem>
              <SelectItem value="MONTHLY">📅 Monthly</SelectItem>
              <SelectItem value="YEARLY">🎯 Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-400">{errors.recurringInterval.message}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="bg-white border-indigo-200 shadow-lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-semibold shadow-md hover:opacity-90 transition-all"
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}

















// "use client";

// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import { CalendarIcon, ScanIcon } from "lucide-react";

// export default function AddTransactionForm() {
//   // ❌ Removed TypeScript type annotation
//   const [date, setDate] = useState(null);

//   useEffect(() => {
//     setDate(new Date());
//   }, []);

//   const [amount, setAmount] = useState("");
//   const [type, setType] = useState("expense");
//   const [account, setAccount] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [recurring, setRecurring] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ✅ Fixed handler (JSX-safe)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // simulate API request
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Transaction created:", {
//         amount,
//         type,
//         account,
//         category,
//         date,
//         description,
//         recurring,
//       });
//       alert("✅ Transaction created successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("❌ Failed to create transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-card rounded-2xl shadow-md border border-border">
//       <h2 className="text-2xl font-semibold mb-4 text-center">
//         Add Transaction
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Amount */}
//         <div>
//           <label className="block mb-1 font-medium">Amount</label>
//           <Input
//             type="number"
//             step="0.01"
//             placeholder="Enter amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />
//         </div>

//         {/* Type */}
//         <div>
//           <label className="block mb-1 font-medium">Type</label>
//           <Select value={type} onValueChange={setType}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="expense">Expense</SelectItem>
//               <SelectItem value="income">Income</SelectItem>
//               <SelectItem value="transfer">Transfer</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Account */}
//         <div>
//           <label className="block mb-1 font-medium">Account</label>
//           <Input
//             placeholder="Enter account name"
//             value={account}
//             onChange={(e) => setAccount(e.target.value)}
//             required
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block mb-1 font-medium">Category</label>
//           <Input
//             placeholder="Enter category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           />
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block mb-1 font-medium">Date</label>
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={18} />
//             <span>
//               {date ? (
//                 format(date, "PPP")
//               ) : (
//                 <span className="text-muted-foreground">Pick a date</span>
//               )}
//             </span>
//           </div>
//           <Calendar
//             mode="single"
//             selected={date || undefined}
//             onSelect={(d) => setDate(d || new Date())}
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block mb-1 font-medium">Description</label>
//           <Input
//             placeholder="Enter description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* Recurring Transaction */}
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             checked={recurring}
//             onCheckedChange={(v) => setRecurring(Boolean(v))}
//           />
//           <label className="font-medium">Recurring Transaction</label>
//         </div>

//         {/* Tooltip for AI Receipt Scan */}
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button type="button" variant="outline" className="w-full">
//                 <ScanIcon className="mr-2 h-4 w-4" /> Scan Receipt with AI
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Automatically fill transaction details from a photo</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>

//         {/* Submit */}
//         <Button type="submit" className="w-full" disabled={isSubmitting}>
//           {isSubmitting ? "Creating..." : "Create Transaction"}
//         </Button>

//         <p className="text-center text-xs text-muted-foreground mt-4">
//           Made with 💗 by Duggu Yadav
//         </p>
//       </form>
//     </div>
//   );
// }























// "use client";

// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import { CalendarIcon, ScanIcon } from "lucide-react";

// export default function AddTransactionForm() {
//   const [date, setDate] = useState(null);

//   useEffect(() => {
//     setDate(new Date());
//   }, []);

//   const [amount, setAmount] = useState("");
//   const [type, setType] = useState("expense");
//   const [account, setAccount] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [recurring, setRecurring] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Transaction created:", {
//         amount,
//         type,
//         account,
//         category,
//         date,
//         description,
//         recurring,
//       });
//       alert("✅ Transaction created successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("❌ Failed to create transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-card rounded-2xl shadow-md border border-border">
//       <h2 className="text-2xl font-semibold mb-4 text-center">
//         Add Transaction
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Amount */}
//         <div>
//           <label className="block mb-1 font-medium">Amount</label>
//           <Input
//             type="number"
//             step="0.01"
//             placeholder="Enter amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />
//         </div>

//         {/* Type */}
//         <div>
//           <label className="block mb-1 font-medium">Type</label>
//           <Select value={type} onValueChange={setType}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="expense">Expense</SelectItem>
//               <SelectItem value="income">Income</SelectItem>
//               <SelectItem value="transfer">Transfer</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Account */}
//         <div>
//           <label className="block mb-1 font-medium">Account</label>
//           <Input
//             placeholder="Enter account name"
//             value={account}
//             onChange={(e) => setAccount(e.target.value)}
//             required
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block mb-1 font-medium">Category</label>
//           <Input
//             placeholder="Enter category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           />
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block mb-1 font-medium">Date</label>
//           <div className="flex items-center gap-2">
//             <CalendarIcon size={18} />
//             <span>
//               {date ? (
//                 format(date, "PPP")
//               ) : (
//                 <span className="text-muted-foreground">Pick a date</span>
//               )}
//             </span>
//           </div>
//           <Calendar
//             mode="single"
//             selected={date || undefined}
//             onSelect={(d) => setDate(d || new Date())}
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block mb-1 font-medium">Description</label>
//           <Input
//             placeholder="Enter description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* Recurring */}
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             checked={recurring}
//             onCheckedChange={(v) => setRecurring(Boolean(v))}
//           />
//           <label className="font-medium">Recurring Transaction</label>
//         </div>

//         {/* Tooltip + AI */}
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button type="button" variant="outline" className="w-full">
//                 <ScanIcon className="mr-2 h-4 w-4" /> Scan Receipt with AI
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Automatically fill transaction details from a photo</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>

//         {/* Submit */}
//         <Button type="submit" className="w-full" disabled={isSubmitting}>
//           {isSubmitting ? "Creating..." : "Create Transaction"}
//         </Button>

//         <p className="text-center text-xs text-muted-foreground mt-4">
//           Made with 💗 by Duggu Yadav
//         </p>
//       </form>
//     </div>
//   );
// }






























// "use client";

// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { CalendarIcon, Loader2, ScanIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";

// export default function AddTransactionForm() {
//   const [date, setDate] = useState(new Date());
//   const [amount, setAmount] = useState("");
//   const [type, setType] = useState("expense");
//   const [account, setAccount] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [recurring, setRecurring] = useState(false);
//   const [recurringInterval, setRecurringInterval] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Simulated AI receipt scanner handler
//   const handleScanReceipt = async () => {
//     toast("🔍 Scanning receipt...");
//     await new Promise((r) => setTimeout(r, 1000));
//     setAmount("249.99");
//     setDescription("Groceries - Reliance Fresh");
//     setCategory("Food");
//     setDate(new Date());
//     toast.success("✅ Receipt scanned successfully!");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1200));
//       console.log("Transaction created:", {
//         amount,
//         type,
//         account,
//         category,
//         date,
//         description,
//         recurring,
//         recurringInterval,
//       });
//       toast.success("Transaction created successfully!");
//     } catch (error) {
//       toast.error("Failed to create transaction");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-card rounded-2xl shadow-md border border-border">
//       <h2 className="text-2xl font-semibold mb-4 text-center text-white">
//         Add Transaction
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5 text-white">
//         {/* Scan Receipt with AI */}
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full border-slate-700 text-white bg-slate-800/60 hover:bg-slate-700/70"
//                 onClick={handleScanReceipt}
//               >
//                 <ScanIcon className="mr-2 h-4 w-4" /> Scan Receipt with AI
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Automatically fill details from a photo of your receipt</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>

//         {/* Amount */}
//         <div>
//           <label className="block mb-1 font-medium text-slate-300">Amount</label>
//           <Input
//             type="number"
//             step="0.01"
//             placeholder="Enter amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//             className="bg-slate-800/60 border-slate-700 text-white"
//           />
//         </div>

//         {/* Type */}
//         <div>
//           <label className="block mb-1 font-medium text-slate-300">Type</label>
//           <Select value={type} onValueChange={setType}>
//             <SelectTrigger className="bg-slate-800/60 border-slate-700">
//               <SelectValue placeholder="Select type" />
//             </SelectTrigger>
//             <SelectContent className="bg-slate-800 border-slate-700">
//               <SelectItem value="expense">💸 Expense</SelectItem>
//               <SelectItem value="income">💰 Income</SelectItem>
//               <SelectItem value="transfer">🔄 Transfer</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Account */}
//         <div>
//           <label className="block mb-1 font-medium text-slate-300">Account</label>
//           <Input
//             placeholder="Enter account name"
//             value={account}
//             onChange={(e) => setAccount(e.target.value)}
//             required
//             className="bg-slate-800/60 border-slate-700 text-white"
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block mb-1 font-medium text-slate-300">Category</label>
//           <Input
//             placeholder="Enter category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="bg-slate-800/60 border-slate-700 text-white"
//           />
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block mb-1 font-medium text-slate-300">Date</label>
//           <div className="flex items-center gap-2 mb-2">
//             <CalendarIcon size={18} />
//             <span>
//               {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
//             </span>
//           </div>
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={(d) => setDate(d || new Date())}
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block mb-1 font-medium text-slate-300">Description</label>
//           <Input
//             placeholder="Enter description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="bg-slate-800/60 border-slate-700 text-white"
//           />
//         </div>

//         {/* Recurring */}
//         <div className="flex items-center space-x-2 border border-slate-700 rounded-lg p-3 bg-slate-800/50">
//           <Checkbox
//             checked={recurring}
//             onCheckedChange={(v) => setRecurring(Boolean(v))}
//           />
//           <label className="font-medium">Recurring Transaction</label>
//         </div>

//         {/* Recurring Interval */}
//         {recurring && (
//           <div>
//             <label className="block mb-1 font-medium text-slate-300">
//               Recurring Interval
//             </label>
//             <Select
//               value={recurringInterval}
//               onValueChange={setRecurringInterval}
//             >
//               <SelectTrigger className="bg-slate-800/60 border-slate-700">
//                 <SelectValue placeholder="Select interval" />
//               </SelectTrigger>
//               <SelectContent className="bg-slate-800 border-slate-700">
//                 <SelectItem value="daily">📆 Daily</SelectItem>
//                 <SelectItem value="weekly">🗓️ Weekly</SelectItem>
//                 <SelectItem value="monthly">📅 Monthly</SelectItem>
//                 <SelectItem value="yearly">🎯 Yearly</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         {/* Submit */}
//         <Button
//           type="submit"
//           className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-semibold shadow-md hover:opacity-90 transition-all"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
//             </>
//           ) : (
//             "Create Transaction"
//           )}
//         </Button>

//         <p className="text-center text-xs text-slate-400 mt-4">
//           Made with 💗 by Duggu Yadav
//         </p>
//       </form>
//     </div>
//   );
// }
