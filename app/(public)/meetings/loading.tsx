export default function Loading() {
  return (
    <div role="status" aria-busy="true" className="animate-pulse space-y-4">
      <span className="sr-only">Loading meetings…</span>
      <div className="h-8 w-48 rounded bg-line" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 rounded-xl border border-line bg-surface" />
      ))}
    </div>
  );
}
