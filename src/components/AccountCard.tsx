"use client";

import { useState } from "react";
import { Check, Pencil, Wallet, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/types";

export default function AccountCard({ account }: { account: Account }) {
  const [name, setName] = useState(account.name);
  const [draft, setDraft] = useState(account.name);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveName() {
    setSaving(true);
    setError("");
    const response = await fetch(`/api/accounts/${account.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: draft }),
    });
    setSaving(false);

    if (!response.ok) {
      setError("Could not rename account.");
      return;
    }

    setName(draft.trim());
    setEditing(false);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-md bg-blue-50 p-2 text-blue-600">
            <Wallet className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {editing ? (
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm font-medium text-slate-950 outline-none focus:border-blue-600"
              />
            ) : (
              <h2 className="truncate font-semibold text-slate-950">{name}</h2>
            )}
            {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
          </div>
        </div>
        {editing ? (
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Save account name"
              onClick={saveName}
              disabled={saving}
              className="rounded-md p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Cancel rename"
              onClick={() => {
                setDraft(name);
                setEditing(false);
              }}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Rename account"
            onClick={() => setEditing(true)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase text-slate-500">Balance</p>
          <p className="mt-1 font-semibold text-blue-600">{formatCurrency(account.balance)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-500">Income</p>
          <p className="mt-1 font-semibold text-green-600">{formatCurrency(account.totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-500">Expenses</p>
          <p className="mt-1 font-semibold text-red-500">{formatCurrency(account.totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
}
