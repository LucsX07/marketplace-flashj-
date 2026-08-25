export default function CarregandoEstabelecimento() {
  return (
    <main className="mx-auto max-w-3xl pb-10 sm:px-6 sm:py-10">
      <div className="skeleton h-40 w-full sm:h-56 sm:rounded-md" />
      <div className="px-4 sm:px-0">
        <div className="mt-4 skeleton h-3 w-24" />
        <div className="mt-2 skeleton h-8 w-56" />
        <div className="mt-2 skeleton h-4 w-72" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((indice) => (
            <div key={indice} className="overflow-hidden rounded-md border border-line bg-surface">
              <div className="skeleton h-36 w-full rounded-none" />
              <div className="space-y-2 p-4">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
