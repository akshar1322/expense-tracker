import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

export default function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const totals = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, total]) => total), 0);

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto mb-3 h-16 w-24 rounded-full bg-blue-50" />
        <p className="font-medium text-slate-950">No expense categories yet</p>
        <p className="mt-1 text-sm text-slate-500">Add an expense to see where your money goes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {rows.map(([category, total]) => (
        <div key={category}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-700">{category}</span>
            <span className="text-slate-500">{formatCurrency(total)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: `${Math.max((total / max) * 100, 5)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
