export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse space-y-space-md px-margin-mobile py-space-xl md:px-8 lg:px-margin" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-40 rounded-full bg-surface-container" />
      <div className="h-10 w-3/4 max-w-xl rounded-xl bg-surface-container" />
      <div className="h-4 w-full max-w-2xl rounded-full bg-surface-container-low" />
      <div className="grid gap-space-sm pt-space-md sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-surface-container-low" />
        ))}
      </div>
    </div>
  );
}
