import TransactionForm from "@/components/TransactionForm";

export default function AddTransactionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <p className="text-sm font-medium text-blue-600">New entry</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Add transaction</h1>
      </div>
      <TransactionForm />
    </div>
  );
}
