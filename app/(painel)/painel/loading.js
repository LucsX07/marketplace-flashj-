export default function CarregandoPainel() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-64" />
      <div className="mt-2 skeleton h-4 w-48" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2].map((indice) => (
          <div key={indice} className="space-y-2 rounded-md border border-line bg-surface p-4">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-40" />
          </div>
        ))}
      </div>
    </main>
  );
}
