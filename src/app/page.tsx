import { Banknote, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import CategoryChart from "@/components/CategoryChart";
import MetricCard from "@/components/MetricCard";
import TransactionItem from "@/components/TransactionItem";
import { prisma } from "@/lib/prisma";
import type { Transaction, TransactionType } from "@/types";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const transactions = await prisma.transaction.findMany({
    include: { account: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  const mapped: Transaction[] = transactions.map((transaction) => ({
    id: transaction.id,
    desc: transaction.desc,
    amount: transaction.amount,
    type: transaction.type as TransactionType,
    category: transaction.category,
    date: transaction.date.toISOString(),
    accountId: transaction.accountId,
    accountName: transaction.account.name,
  }));

  const totalIncome = mapped
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = mapped
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    transactions: mapped,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

export default async function DashboardPage() {
  const { transactions, totalIncome, totalExpenses, balance } = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Personal finance</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Dashboard</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total balance" value={balance} icon={Banknote} tone="blue" />
        <MetricCard title="Total income" value={totalIncome} icon={TrendingUp} tone="green" />
        <MetricCard title="Total expenses" value={totalExpenses} icon={TrendingDown} tone="red" />
        <MetricCard title="Net savings" value={balance} icon={PiggyBank} tone="slate" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-950">Expenses by category</h2>
          <CategoryChart transactions={transactions} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-slate-950">Recent transactions</h2>
          {transactions.length ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="mx-auto h-16 w-20 rounded-lg bg-blue-50" />
              <p className="mt-4 font-medium text-slate-950">No transactions yet</p>
              <p className="mt-1 text-sm text-slate-500">Add your first income or expense to begin.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
