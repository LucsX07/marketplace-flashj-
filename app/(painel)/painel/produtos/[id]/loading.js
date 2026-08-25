export default function CarregandoEdicaoProduto() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="skeleton h-4 w-20" />
      <div className="mt-2 skeleton h-8 w-56" />
      <div className="mt-1 skeleton h-4 w-72" />

      <div className="mt-6 space-y-4">
        {[0, 1, 2].map((indice) => (
          <div key={indice} className="space-y-3 rounded-md border border-line bg-surface p-4">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
    </main>
  );
}
