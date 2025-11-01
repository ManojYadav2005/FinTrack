// // original code
// "use client";

// import { useState, useEffect } from "react";
// import { Pencil, Check, X } from "lucide-react";
// import useFetch from "@/hooks/use-fetch";
// import { toast } from "sonner";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { updateBudget } from "@/actions/budget";

// export function BudgetProgress({ initialBudget, currentExpenses }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");
//   const [budgetAmount, setBudgetAmount] = useState(initialBudget?.amount || 0);

//   const {
//     loading: isLoading,
//     fn: updateBudgetFn,
//     data: updatedBudget,
//     error,
//   } = useFetch(updateBudget);

//   const percentUsed = budgetAmount ? (currentExpenses / budgetAmount) * 100 : 0;

//   const handleUpdateBudget = async () => {
//     const amount = parseFloat(newBudget);

//     if (isNaN(amount) || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }

//     try {
//       const res = await updateBudgetFn(amount);
//       if (res?.success) {
//         setBudgetAmount(res.data.amount); // update UI immediately
//         setIsEditing(false);
//         toast.success("Budget updated successfully");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to update budget");
//     }
//   };

//   const handleCancel = () => {
//     setNewBudget(budgetAmount.toString());
//     setIsEditing(false);
//   };

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to update budget");
//     }
//   }, [error]);

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <div className="flex-1">
//           <CardTitle className="text-sm font-medium">
//             Monthly Budget (Default Account)
//           </CardTitle>
//           <div className="flex items-center gap-2 mt-1">
//             {isEditing ? (
//               <div className="flex items-center gap-2">
//                 <Input
//                   type="number"
//                   value={newBudget}
//                   onChange={(e) => setNewBudget(e.target.value)}
//                   className="w-32"
//                   placeholder="Enter amount"
//                   autoFocus
//                   disabled={isLoading}
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleUpdateBudget}
//                   disabled={isLoading}
//                 >
//                   <Check className="h-4 w-4 text-green-500" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleCancel}
//                   disabled={isLoading}
//                 >
//                   <X className="h-4 w-4 text-red-500" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <CardDescription>
//                   {budgetAmount
//                     ? `$${currentExpenses.toFixed(2)} of $${budgetAmount.toFixed(2)} spent`
//                     : "No budget set"}
//                 </CardDescription>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsEditing(true)}
//                   className="h-6 w-6"
//                 >
//                   <Pencil className="h-3 w-3" />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {budgetAmount && (
//           <div className="space-y-2">
//             <Progress
//               value={percentUsed}
//               extraStyles={`${
//                 percentUsed >= 90
//                   ? "bg-red-500"
//                   : percentUsed >= 75
//                   ? "bg-yellow-500"
//                   : "bg-green-500"
//               }`}
//             />
//             <p className="text-xs text-muted-foreground text-right">
//               {percentUsed.toFixed(1)}% used
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }






















"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");
  const [budgetAmount, setBudgetAmount] = useState(initialBudget?.amount || 0);

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = budgetAmount ? (currentExpenses / budgetAmount) * 100 : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const res = await updateBudgetFn(amount);
      if (res?.success) {
        setBudgetAmount(res.data.amount); // update UI immediately
        setIsEditing(false);
        toast.success("Budget updated successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update budget");
    }
  };

  const handleCancel = () => {
    setNewBudget(budgetAmount.toString());
    setIsEditing(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="relative bg-gradient-to-br from-gray-950 via-orange-900 to-slate-900
 border border-slate-700/60 rounded-2xl shadow-md hover:shadow-[0_0_25px_-5px_rgba(251,146,60,0.3)] hover:border-orange-400/50 transition-all duration-300 overflow-hidden group">
      {/* Glow Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"></div>
  
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <div className="flex-1">
          <CardTitle className="text-sm font-semibold text-slate-200 tracking-wide group-hover:text-orange-400 transition-colors duration-200">
            Monthly Budget <span className="text-slate-400">(Default Account)</span>
          </CardTitle>
  
          <div className="flex items-center gap-2 mt-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32 bg-slate-900/70 border border-slate-700 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400 rounded-lg shadow-sm"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="hover:bg-green-500/10 rounded-full transition-colors"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="hover:bg-red-500/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-slate-400 text-sm">
                  {budgetAmount
                    ? (
                      <>
                        <span className="text-slate-200 font-medium">
                          ${currentExpenses.toFixed(2)}
                        </span>{" "}
                        of{" "}
                        <span className="text-amber-400 font-semibold">
                          ${budgetAmount.toFixed(2)}
                        </span>{" "}
                        spent
                      </>
                    )
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 hover:bg-orange-500/10 rounded-full transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-orange-400" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
  
      <CardContent className="relative z-10">
        {budgetAmount && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : percentUsed >= 75
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                  : "bg-gradient-to-r from-green-400 to-emerald-500"
              } shadow-md`}
            />
            <p className="text-xs text-slate-400 text-right font-medium tracking-wide">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  
}
