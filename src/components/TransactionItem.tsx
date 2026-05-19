import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: number) => void;
  deleting?: boolean;
}

export default function TransactionItem({
  transaction,
  onDelete,
  deleting,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className={isIncome ? "text-green-600" : "text-red-500"}>
        {isIncome ? <ArrowUpCircle className="h-7 w-7" /> : <ArrowDownCircle className="h-7 w-7" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="truncate font-medium text-slate-950">{transaction.desc}</p>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {transaction.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {transaction.accountName} • {format(new Date(transaction.date), "dd MMM yyyy")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className={isIncome ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        {onDelete ? (
          <button
            type="button"
            aria-label="Delete transaction"
            disabled={deleting}
            onClick={() => onDelete(transaction.id)}
            className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
