export default function CarregandoMinhaLoja() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="skeleton h-4 w-16" />
      <div className="mt-2 skeleton h-8 w-40" />

      <div className="mt-6 flex items-center gap-3">
        <div className="skeleton h-20 w-20 rounded-md" />
        <div className="skeleton h-9 w-32 rounded-md" />
      </div>

      <div className="mt-6 skeleton h-16 w-full rounded-md" />

      <div className="mt-6 space-y-4">
        {[0, 1, 2, 3, 4].map((indice) => (
          <div key={indice} className="space-y-2">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
    </main>
  );
}
