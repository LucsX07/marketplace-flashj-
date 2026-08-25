import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import { listarEstabelecimentos } from "@/lib/estabelecimentos";

export default async function PaginaInicial() {
  const estabelecimentos = await listarEstabelecimentos();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Perto de você, agora
      </h1>
      <span className="mt-3 block h-1 w-12 bg-brand" />
      <p className="mt-4 text-ink-muted">Escolha um estabelecimento perto de você.</p>

      {estabelecimentos.length === 0 ? (
        <div className="relative mt-8 overflow-hidden rounded-md border border-line bg-surface p-10 text-center">
          <div className="grid-texture pointer-events-none absolute inset-0" />
          <p className="relative text-ink-muted">Nenhum estabelecimento cadastrado ainda.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {estabelecimentos.map((estabelecimento) => (
            <EstabelecimentoCard key={estabelecimento.id} estabelecimento={estabelecimento} />
          ))}
        </div>
      )}
    </main>
  );
}
