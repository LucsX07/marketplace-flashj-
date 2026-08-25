export default function CarregandoMeusPedidos() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-40" />
      <div className="mt-3 h-1 w-12 bg-line" />

      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((indice) => (
          <div key={indice} className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-40" />
              </div>
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
