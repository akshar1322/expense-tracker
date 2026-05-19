"use client";

import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";
import TransactionItem from "@/components/TransactionItem";
import type { Transaction, TransactionType } from "@/types";

type Filter = "all" | TransactionType;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const query = filter === "all" ? "" : `?type=${filter}`;
    fetch(`/api/transactions${query}`)
      .then((response) => response.json())
      .then((data: Transaction[]) => setTransactions(data))
      .catch(() => setError("Could not load transactions."))
      .finally(() => setLoading(false));
  }, [filter]);

  async function deleteTransaction(id: number) {
    setDeleting(id);
    const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setDeleting(null);

    if (!response.ok) {
      setError("Could not delete transaction.");
      return;
    }

    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "income", "expense"] as Filter[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === option ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : transactions.length ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={deleteTransaction}
              deleting={deleting === transaction.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <ReceiptText className="mx-auto h-14 w-14 text-blue-200" />
          <p className="mt-4 font-medium text-slate-950">No transactions found</p>
          <p className="mt-1 text-sm text-slate-500">Your matching transactions will appear here.</p>
        </div>
      )}
    </div>
  );
}
