export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-52 animate-pulse rounded bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}
