export default function CarregandoPedido() {
  return (
    <main className="mx-auto max-w-2xl pb-10 sm:px-6 sm:py-10">
      <div className="px-4 sm:px-0">
        <div className="skeleton h-4 w-24" />
      </div>

      <div className="mt-4 skeleton h-32 w-full rounded-none sm:rounded-md" />

      <div className="px-4 sm:px-0">
        <div className="mt-4 skeleton h-8 w-56" />
        <div className="mt-3 skeleton h-6 w-28 rounded-full" />

        <div className="mt-8 space-y-3">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-3/4" />
        </div>

        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((indice) => (
            <div key={indice} className="flex gap-3">
              <div className="skeleton h-3 w-3 rounded-full" />
              <div className="skeleton h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
