import TransactionHistory from "@/components/TransactionHistory";

export default function HistoryPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-blue-600">Ledger</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Transaction history</h1>
      </div>
      <TransactionHistory />
    </div>
  );
}
