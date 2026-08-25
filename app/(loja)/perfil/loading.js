export default function CarregandoPerfil() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="skeleton h-8 w-48" />
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((indice) => (
          <div key={indice} className="space-y-2 rounded-md border border-line bg-surface p-4">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-48" />
          </div>
        ))}
      </div>
    </main>
  );
}
