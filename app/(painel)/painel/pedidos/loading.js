export default function CarregandoPedidosRecebidos() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-52" />

      <div className="mt-6 space-y-4">
        {[0, 1, 2].map((indice) => (
          <div key={indice} className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="skeleton h-3 w-40" />
              <div className="skeleton h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
