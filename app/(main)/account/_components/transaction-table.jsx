"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatCurrency";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) result = result.filter((t) => t.type === typeFilter);

    if (recurringFilter) {
      result = result.filter((t) =>
        recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((curr) => ({
      field,
      direction:
        curr.field === field && curr.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((curr) =>
      curr.includes(id) ? curr.filter((i) => i !== id) : [...curr, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((curr) =>
      curr.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} transactions?`)) return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="terminal-card overflow-hidden">
      {deleteLoading && <BarLoader width="100%" color="#3b82f6" />}

      {/* Header / Filters */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Query descriptions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 bg-slate-900 border-slate-700 text-slate-200 font-mono text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] h-9 bg-slate-900 border-slate-700 text-slate-300 font-mono text-xs">
                <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                <SelectItem value="INCOME" className="font-mono text-xs hover:bg-slate-800">INCOME</SelectItem>
                <SelectItem value="EXPENSE" className="font-mono text-xs hover:bg-slate-800">EXPENSE</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={recurringFilter}
              onValueChange={(v) => {
                setRecurringFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-9 bg-slate-900 border-slate-700 text-slate-300 font-mono text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-2 text-slate-500" />
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                <SelectItem value="recurring" className="font-mono text-xs hover:bg-slate-800">Recurring</SelectItem>
                <SelectItem value="non-recurring" className="font-mono text-xs hover:bg-slate-800">One-time</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFilters}
                className="h-9 w-9 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {selectedIds.length > 0 && (
              <Button
                size="sm"
                onClick={handleBulkDelete}
                className="h-9 px-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 font-mono text-xs transition-colors"
              >
                <Trash className="h-3.5 w-3.5 mr-1.5" />
                DELETE ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="sql-table min-w-[800px]">
          <TableHeader>
            <TableRow className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/60">
              <TableHead className="w-[40px] border-b border-slate-700 py-3">
                <Checkbox
                  checked={selectedIds.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </TableHead>
              {["date", "description", "category", "amount", "recurring"].map((col) => (
                <TableHead
                  key={col}
                  onClick={() => handleSort(col)}
                  className={cn(
                    "cursor-pointer hover:text-blue-400 transition-colors border-b border-slate-700 py-3 text-[10px] uppercase tracking-widest text-cyan-400",
                    col === "amount" && "text-right"
                  )}
                >
                  {col}
                  {sortConfig.field === col && (
                    sortConfig.direction === "asc" 
                      ? <ChevronUp className="inline ml-1 w-3.5 h-3.5" />
                      : <ChevronDown className="inline ml-1 w-3.5 h-3.5" />
                  )}
                </TableHead>
              ))}
              <TableHead className="w-[50px] border-b border-slate-700" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableCell colSpan={7} className="h-32 text-center">
                  <p className="text-sm font-mono text-slate-500">0 rows returned</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((t) => (
                <TableRow key={t.id} className="border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
                  <TableCell className="py-2.5">
                    <Checkbox
                      checked={selectedIds.includes(t.id)}
                      onCheckedChange={() => handleSelect(t.id)}
                      className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableCell>
                  <TableCell className="py-2.5 font-mono text-xs text-slate-400 whitespace-nowrap">
                    {format(new Date(t.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="py-2.5 font-sans text-sm text-slate-200">
                    {t.description}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="sql-badge sql-badge-blue text-[10px]">
                      {t.category}
                    </span>
                  </TableCell>
                  <TableCell className={cn(
                    "py-2.5 text-right font-mono text-sm",
                    t.type === "EXPENSE" ? "text-red-400" : "text-green-400"
                  )}>
                    {t.type === "EXPENSE" ? "-" : "+"}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className="py-2.5">
                    {t.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-mono">
                              <RefreshCw className="w-3 h-3" />
                              {RECURRING_INTERVALS[t.recurringInterval]}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200 font-mono text-xs">
                            <p className="text-slate-400 mb-1">Next Occurrence:</p>
                            <p>{format(new Date(t.nextRecurringDate), "dd MMM yyyy")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 text-slate-500 text-[10px] font-mono">
                        <Clock className="w-3 h-3" />
                        One-time
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-700">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 font-mono text-xs shadow-xl min-w-[120px]">
                        <DropdownMenuItem
                          onClick={() => router.push(`/transaction/create?edit=${t.id}`)}
                          className="text-slate-300 hover:bg-slate-800 hover:text-white focus:bg-slate-800 cursor-pointer"
                        >
                          EDIT
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                          onClick={() => deleteFn([t.id])}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                        >
                          DELETE
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/20">
          <p className="text-xs font-mono text-slate-500">
            Showing <span className="text-slate-300">{paginatedTransactions.length}</span> of <span className="text-slate-300">{filteredAndSortedTransactions.length}</span> records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-mono text-slate-400 px-2">
              PG {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
