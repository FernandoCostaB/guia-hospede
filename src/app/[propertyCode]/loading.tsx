export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl bg-border animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-32 bg-border rounded animate-pulse" />
        <div className="h-8 w-64 bg-border rounded animate-pulse" />
        <div className="h-4 w-48 bg-border rounded animate-pulse" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-6 space-y-3"
        >
          <div className="h-5 w-40 bg-border rounded animate-pulse" />
          <div className="h-4 w-full bg-border rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-border rounded animate-pulse" />
        </div>
      ))}
    </main>
  )
}
