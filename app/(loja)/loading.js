export default function CarregandoInicio() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="skeleton h-9 w-64" />
      <div className="mt-2 skeleton h-4 w-72" />
      <div className="mt-3 h-1 w-12 bg-line" />
      <div className="mt-6 skeleton h-10 w-full max-w-md rounded-md" />

      <div className="mt-10 skeleton h-6 w-32" />
      <div className="stagger mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[0, 1, 2].map((indice) => (
          <div key={indice} className="overflow-hidden rounded-md border border-line bg-surface">
            <div className="skeleton h-28 w-full rounded-none" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
