export default function CarregandoProdutos() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-40" />
      <div className="mt-2 skeleton h-4 w-64" />

      <div className="mt-8 space-y-3">
        {[0, 1, 2, 3].map((indice) => (
          <div
            key={indice}
            className="flex items-center justify-between rounded-md border border-line bg-surface p-4"
          >
            <div className="space-y-2">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-3 w-16" />
            </div>
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
    </main>
  );
}
