"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { expenseCategories, incomeCategories, type Account, type TransactionType } from "@/types";

export default function TransactionForm() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [type, setType] = useState<TransactionType>("expense");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(expenseCategories[0]);
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categories = useMemo(
    () => (type === "income" ? incomeCategories : expenseCategories),
    [type],
  );

  useEffect(() => {
    fetch("/api/accounts")
      .then((response) => response.json())
      .then((data: Account[]) => {
        setAccounts(data);
        setAccountId(String(data[0]?.id || ""));
      })
      .catch(() => setError("Could not load accounts."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategory(categories[0]);
  }, [categories]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        desc,
        amount: Number(amount),
        type,
        category,
        accountId: Number(accountId),
        date,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      setError("Could not save transaction.");
      return;
    }

    setDesc("");
    setAmount("");
    setMessage("Transaction saved successfully.");
    router.refresh();
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-lg bg-slate-100" />;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
        {(["expense", "income"] as TransactionType[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
              type === option
                ? option === "income"
                  ? "bg-green-600 text-white"
                  : "bg-red-500 text-white"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <input
            required
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            placeholder="Monthly salary"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Amount in INR</span>
          <input
            required
            min="1"
            step="0.01"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            placeholder="55000"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Account</span>
          <select
            required
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Date</span>
          <input
            required
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      {message ? <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        <PlusCircle className="h-5 w-5" />
        {saving ? "Saving..." : "Add transaction"}
      </button>
    </form>
  );
}
