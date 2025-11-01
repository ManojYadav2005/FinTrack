// correct code

import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

async function TransactionFormLoader({ editId }) {
  let accounts = [];
  let initialData = null;
  let fetchError = null;

  try {
    accounts = await getUserAccounts();
  } catch (error) {
    console.error("Error fetching accounts for AddTransactionPage:", error);
    fetchError = "Failed to load accounts data. Please try again later.";
  }

  if (!fetchError && editId) {
    try {
      initialData = await getTransaction(editId);
    } catch (error) {
      console.error("Error fetching transaction data for AddTransactionPage:", error);
      fetchError = "Failed to load transaction data. Please try again later.";
    }
  }

  if (fetchError) {
    return (
      <div className="max-w-3xl mx-auto px-5 text-center">
        <h1 className="text-2xl text-red-500">{fetchError}</h1>
      </div>
    );
  }

  return (
    <AddTransactionForm
      accounts={accounts}
      categories={defaultCategories}
      editMode={!!editId}
      initialData={initialData}
    />
  );
}

export default async function AddTransactionPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams?.edit;

  return (
    <div className="max-w-3xl mx-auto px-5">
    <div className="flex justify-center md:justify-normal mb-8">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
        Add Transaction
      </h1>
    </div>
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="size-8 animate-spin text-amber-500" />
        </div>
      }
      >
        <TransactionFormLoader editId={editId} />
      </Suspense>
    </div>
  );
}



// rm -rf .next
// npm run dev






















// // app/(main)/transaction/create/page.jsx

// import { getUserAccounts } from "@/actions/dashboard";
// import { defaultCategories } from "@/data/categories";
// import { AddTransactionForm } from "../_components/transaction-form";
// import { getTransaction } from "@/actions/transaction";
// import { Loader2 } from "lucide-react";

// export const dynamic = "force-dynamic";

// async function TransactionFormLoader({ editId }) {
//   let accounts = [];
//   let initialData = null;
//   let fetchError = null;

//   try {
//     accounts = await getUserAccounts();
//   } catch (error) {
//     console.error("Error fetching accounts:", error);
//     fetchError = "Failed to load accounts data. Please try again later.";
//   }

//   if (!fetchError && editId) {
//     try {
//       initialData = await getTransaction(editId);
//     } catch (error) {
//       console.error("Error fetching transaction:", error);
//       fetchError = "Failed to load transaction data. Please try again later.";
//     }
//   }

//   if (fetchError) {
//     return (
//       <div className="max-w-3xl mx-auto px-5 text-center">
//         <h1 className="text-2xl text-red-500">{fetchError}</h1>
//       </div>
//     );
//   }

//   return (
//     <AddTransactionForm
//       accounts={accounts}
//       categories={defaultCategories}
//       editMode={!!editId}
//       initialData={initialData}
//     />
//   );
// }

// export default async function AddTransactionPage({ searchParams }) {
//   const editId = searchParams?.edit || null;

//   return (
//     <div className="max-w-3xl mx-auto px-5">
//       <div className="flex justify-center md:justify-normal mb-8">
//         <h1 className="text-5xl gradient-title">
//           {editId ? "Edit Transaction" : "Add Transaction"}
//         </h1>
//       </div>

//       {/* Server-side loading fallback */}
//       <div className="min-h-64 flex items-center justify-center">
//         <TransactionFormLoader editId={editId} />
//       </div>
//     </div>
//   );
// }








// import { getUserAccounts } from "@/actions/dashboard";
// import { defaultCategories } from "@/data/categories";
// import AddTransactionForm from "../_components/transaction-form"; // ✅ FIXED default import
// import { getTransaction } from "@/actions/transaction";
// import { Suspense } from "react";
// import { Loader2 } from "lucide-react";

// export const dynamic = "force-dynamic";

// async function TransactionFormLoader({ editId }) {
//   let accounts = [];
//   let initialData = null;
//   let fetchError = null;

//   try {
//     accounts = await getUserAccounts();
//   } catch (error) {
//     console.error("Error fetching accounts for AddTransactionPage:", error);
//     fetchError = "Failed to load accounts data. Please try again later.";
//   }

//   if (!fetchError && editId) {
//     try {
//       initialData = await getTransaction(editId);
//     } catch (error) {
//       console.error("Error fetching transaction data for AddTransactionPage:", error);
//       fetchError = "Failed to load transaction data. Please try again later.";
//     }
//   }

//   if (fetchError) {
//     return (
//       <div className="max-w-3xl mx-auto px-5 text-center">
//         <h1 className="text-2xl text-red-500">{fetchError}</h1>
//       </div>
//     );
//   }

//   return (
//     <AddTransactionForm
//       accounts={accounts}
//       categories={defaultCategories}
//       editMode={!!editId}
//       initialData={initialData}
//     />
//   );
// }

// export default async function AddTransactionPage({ searchParams }) {
//   const resolvedParams = await searchParams;
//   const editId = resolvedParams?.edit;

//   return (
//     <div className="max-w-3xl mx-auto px-5">
//       <div className="flex justify-center md:justify-normal mb-8">
//         <h1 className="text-5xl gradient-title">Add Transaction</h1>
//       </div>

//       <Suspense
//         fallback={
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="size-8 animate-spin text-gray-400" />
//           </div>
//         }
//       >
//         <TransactionFormLoader editId={editId} />
//       </Suspense>
//     </div>
//   );
// }






























