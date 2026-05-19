import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: "blue" | "green" | "red" | "slate";
}

const tones = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-500",
  slate: "bg-slate-100 text-slate-700",
};

export default function MetricCard({ title, value, icon: Icon, tone }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCurrency(value)}</p>
        </div>
        <span className={cn("rounded-md p-2", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
