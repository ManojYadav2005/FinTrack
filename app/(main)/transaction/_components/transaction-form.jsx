// // 1 time change
// // original code

// // correct code version 1

// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import { format } from "date-fns";
// import { useRouter, useSearchParams } from "next/navigation";
// import useFetch from "@/hooks/use-fetch";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { CreateAccountDrawer } from "@/components/create-account-drawer";
// import { cn } from "@/lib/utils";
// import { createTransaction, updateTransaction } from "@/actions/transaction";
// import { transactionSchema } from "@/app/lib/schema";
// import { ReceiptScanner } from "./recipt-scanner";

// export function AddTransactionForm({
//   accounts,
//   categories,
//   editMode = false,
//   initialData = null,
// }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editId = searchParams.get("edit");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//     getValues,
//     reset,
//   } = useForm({
//     resolver: zodResolver(transactionSchema),
//     defaultValues:
//       editMode && initialData
//         ? {
//             type: initialData.type,
//             amount: initialData.amount.toString(),
//             description: initialData.description,
//             accountId: initialData.accountId,
//             category: initialData.category,
//             date: new Date(initialData.date),
//             isRecurring: initialData.isRecurring,
//             ...(initialData.recurringInterval && {
//               recurringInterval: initialData.recurringInterval,
//             }),
//           }
//         : {
//             type: "EXPENSE",
//             amount: "",
//             description: "",
//             accountId: accounts.find((ac) => ac.isDefault)?.id,
//             date: new Date(),
//             isRecurring: false,
//           },
//   });

//   const {
//     loading: transactionLoading,
//     fn: transactionFn,
//     data: transactionResult,
//   } = useFetch(editMode ? updateTransaction : createTransaction);

//   const onSubmit = (data) => {
//     const formData = { ...data, amount: parseFloat(data.amount) };
//     if (editMode) transactionFn(editId, formData);
//     else transactionFn(formData);
//   };

//   const handleScanComplete = (scannedData) => {
//     if (scannedData) {
//       setValue("amount", scannedData.amount.toString());
//       setValue("date", new Date(scannedData.date));
//       if (scannedData.description) setValue("description", scannedData.description);
//       if (scannedData.category) setValue("category", scannedData.category);
//       toast.success("Receipt scanned successfully");
//     }
//   };

//   useEffect(() => {
//     if (transactionResult?.success && !transactionLoading) {
//       toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
//       reset();
//       router.push(`/account/${transactionResult.data.accountId}`);
//     }
//   }, [transactionResult, transactionLoading, editMode]);

//   const type = watch("type");
//   const isRecurring = watch("isRecurring");
//   const date = watch("date");
//   const filteredCategories = categories.filter((category) => category.type === type);

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6 bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-300 text-slate-900"

// >
//       {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

//       {/* Type */}
//       <div className="space-y-2">
//       <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">
//   Type
// </label>

//         <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
//           <SelectTrigger className="space-y-6 bg-gradient-to-br from-sky-50 via-cyan-100 to-blue-100 text-slate-900">
//             <SelectValue placeholder="Select type" />
//           </SelectTrigger>
//           <SelectContent className="space-y-6 bg-gradient-to-br from-indigo-50 via-blue-100/80 to-purple-50/80 backdrop-blur-xl text-slate-900 shadow-lg rounded-2xl">
//             <SelectItem value="EXPENSE">💸 Expense</SelectItem>
//             <SelectItem value="INCOME">💰 Income</SelectItem>
//           </SelectContent>
//         </Select>
//         {errors.type && <p className="text-sm text-red-400">{errors.type.message}</p>}
//       </div>

//       {/* Amount + Account */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="space-y-2">
//           <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Amount</label>
//           <Input
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//             {...register("amount")}
//             className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400"
//           />
//           {errors.amount && <p className="text-sm text-red-400">{errors.amount.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Account</label>
//           <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
//             <SelectTrigger className="bg-slate-800/60 border-slate-700 focus:ring-2 focus:ring-orange-400">
//               <SelectValue placeholder="Select account" />
//             </SelectTrigger>
//             <SelectContent className="bg-slate-800 border-slate-700">
//               {accounts.map((account) => (
//                 <SelectItem key={account.id} value={account.id}>
//                   🏦 {account.name} (${parseFloat(account.balance).toFixed(2)})
//                 </SelectItem>
//               ))}
//               <CreateAccountDrawer>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold mt-2 hover:scale-105 transition-transform"
//                 >
//                   + Create Account
//                 </Button>
//               </CreateAccountDrawer>
//             </SelectContent>
//           </Select>
//           {errors.accountId && <p className="text-sm text-red-400">{errors.accountId.message}</p>}
//         </div>
//       </div>

//       {/* Category */}
//       <div className="space-y-2">
//         <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Category</label>
//         <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
//           <SelectTrigger className="bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-300 text-slate-900 focus:ring-2 focus:ring-indigo-400">
//             <SelectValue placeholder="Select category" />
//           </SelectTrigger>
//           <SelectContent className="bg-white border-indigo-200 shadow-lg">

//             {filteredCategories.map((category) => (
//               <SelectItem key={category.id} value={category.id}>
//                 🗂️ {category.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}
//       </div>

//       {/* Date */}
//       <div className="space-y-2">
//         <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Date</label>
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn(
//                 "w-full bg-slate-800/60 border-slate-700 text-slate-100 hover:bg-slate-700/70 transition",
//                 !date && "text-slate-400"
//               )}
//             >
//               {date ? format(date, "PPP") : <span>Pick a date</span>}
//               <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={(date) => setValue("date", date)}
//               disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
//               initialFocus
//             />
//           </PopoverContent>
//         </Popover>
//         {errors.date && <p className="text-sm text-red-400">{errors.date.message}</p>}
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <label className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">Description</label>
//         <Input
//           placeholder="Enter description"
//           {...register("description")}
//            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400"
// />
//         {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
//       </div>

//       {/* Recurring Toggle */}
//       <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800 transition">
//         <div className="space-y-0.5">
//           <label className="text-base font-semibold text-slate-11">Recurring Transaction</label>
//           <div className="text-sm text-slate-40">
//             Set up a recurring schedule for this transaction
//           </div>
//         </div>
//         <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
//       </div>

//       {/* Recurring Interval */}
//       {isRecurring && (
//         <div className="space-y-2">
//           <label className="text-sm font-semibold text-slate-200">Recurring Interval</label>
//           <Select
//             onValueChange={(value) => setValue("recurringInterval", value)}
//             defaultValue={getValues("recurringInterval")}
//           >
//             <SelectTrigger className="bg-slate-800/60 border-slate-700 focus:ring-2 focus:ring-orange-400">
//               <SelectValue placeholder="Select interval" />
//             </SelectTrigger>
//             <SelectContent className="block text-lg font-bold text-amber-700 tracking-wide drop-shadow-md">
//               <SelectItem value="DAILY">📆 Daily</SelectItem>
//               <SelectItem value="WEEKLY">🗓️ Weekly</SelectItem>
//               <SelectItem value="MONTHLY">📅 Monthly</SelectItem>
//               <SelectItem value="YEARLY">🎯 Yearly</SelectItem>
//             </SelectContent>
//           </Select>
//           {errors.recurringInterval && (
//             <p className="text-sm text-red-400">{errors.recurringInterval.message}</p>
//           )}
//         </div>
//       )}

//       {/* Actions */}
//       <div className="flex gap-4">
//         <Button
//           type="button"
//           variant="outline"
//           className="bg-white border-indigo-200 shadow-lg"
//           onClick={() => router.back()}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-semibold shadow-md hover:opacity-90 transition-all"
//           disabled={transactionLoading}
//         >
//           {transactionLoading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               {editMode ? "Updating..." : "Creating..."}
//             </>
//           ) : editMode ? (
//             "Update Transaction"
//           ) : (
//             "Create Transaction"
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// }























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
    className="space-y-8 p-8 rounded-2xl border border-white/10 
               bg-gradient-to-br from-indigo-900 via-teal-800 via-green-800 to-emerald-900
               shadow-[0_0_40px_-10px_rgba(45,212,191,0.4)]
               text-slate-100 transition-all duration-700 hover:shadow-teal-500/50 backdrop-blur-lg"
  >
  
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}
  
      {/* Type */}
      <div className="space-y-2">
        <label className="block text-lg font-extrabold text-amber-400 tracking-wide drop-shadow-md uppercase">
          Type
        </label>
  
        <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
          <SelectTrigger className="bg-slate-800/60 border border-slate-700 hover:border-amber-400/60 transition rounded-xl text-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-amber-50 via-orange-100/80 to-yellow-50/70 text-slate-900 font-medium shadow-xl rounded-2xl border border-amber-300">
            <SelectItem value="EXPENSE">💸 Expense</SelectItem>
            <SelectItem value="INCOME">💰 Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-400">{errors.type.message}</p>}
      </div>
  
      {/* Amount + Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-lg font-extrabold text-amber-400 tracking-wide drop-shadow-md uppercase">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            className="bg-slate-900/70 border border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 rounded-xl shadow-inner"
          />
          {errors.amount && <p className="text-sm text-red-400">{errors.amount.message}</p>}
        </div>
  
        <div className="space-y-2">
          <label className="block text-lg font-extrabold text-amber-400 tracking-wide drop-shadow-md uppercase">Account</label>
          <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
            <SelectTrigger className="bg-slate-900/70 border border-slate-700 hover:border-amber-400/60 focus:ring-2 focus:ring-amber-500 rounded-xl text-white">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-200 shadow-xl rounded-2xl">
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  🏦 {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="w-full justify-center bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold mt-2 hover:scale-105 transition-transform rounded-lg"
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
        <label className="block text-lg font-extrabold text-amber-400 tracking-wide drop-shadow-md uppercase">Category</label>
        <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
          <SelectTrigger className="bg-slate-900/70 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 rounded-xl">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700 rounded-2xl text-slate-200 shadow-xl">
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
        <label className="block text-lg font-extrabold text-amber-400 tracking-wide drop-shadow-md uppercase">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full bg-slate-900/70 border border-slate-700 text-slate-100 hover:bg-slate-800 transition rounded-xl",
                !date && "text-slate-400"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-900 border border-slate-700 rounded-xl shadow-lg" align="start">
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
        <label className="block text-lg font-extrabold text-amber-400 tracking-wide drop-shadow-md uppercase">Description</label>
        <Input
          placeholder="Enter description"
          {...register("description")}
          className="bg-slate-900/70 border border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 rounded-xl shadow-inner"
        />
        {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
      </div>
  
      {/* Recurring Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:bg-slate-800 transition">
        <div>
          <label className="text-base font-semibold text-slate-100">Recurring Transaction</label>
          <p className="text-sm text-slate-400">Set up a recurring schedule for this transaction</p>
        </div>
        <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
      </div>
  
      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-lg font-bold text-amber-400 uppercase">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="bg-slate-900/70 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 rounded-xl">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border border-slate-700 rounded-xl text-slate-200 shadow-lg">
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
          className="bg-gradient-to-r from-slate-700 to-slate-900 border border-slate-600 text-white shadow-lg hover:scale-105 transition-transform rounded-xl"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:opacity-90 hover:shadow-pink-500/30 transition-all rounded-xl"
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














