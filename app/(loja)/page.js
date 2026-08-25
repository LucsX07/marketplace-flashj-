import { cookies } from "next/headers";
import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import PortaDeEntrada from "@/components/PortaDeEntrada";
import { listarEstabelecimentos } from "@/lib/estabelecimentos";
import { limparCidade } from "@/lib/actions/cidade";

function agruparPorCategoria(estabelecimentos) {
  const grupos = new Map();
  for (const estabelecimento of estabelecimentos) {
    const nomeCategoria = estabelecimento.categorias?.nome || "Outros";
    if (!grupos.has(nomeCategoria)) {
      grupos.set(nomeCategoria, []);
    }
    grupos.get(nomeCategoria).push(estabelecimento);
  }
  return grupos;
}

export default async function PaginaInicial() {
  const cookieStore = await cookies();
  const cidade = cookieStore.get("cidade")?.value;

  if (!cidade) {
    return <PortaDeEntrada />;
  }

  const estabelecimentos = await listarEstabelecimentos(cidade);
  const grupos = agruparPorCategoria(estabelecimentos);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            FlashJá em {cidade}
          </h1>
          <p className="mt-1 text-ink-muted">Tudo o que você precisa, conectado à sua cidade.</p>
        </div>
        <form action={limparCidade}>
          <button
            type="submit"
            className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover"
          >
            Trocar cidade
          </button>
        </form>
      </div>
      <span className="mt-3 block h-1 w-12 bg-brand" />

      {estabelecimentos.length === 0 ? (
        <div className="animate-entrada relative mt-8 overflow-hidden rounded-md border border-line bg-surface p-10 text-center">
          <div className="grid-texture pointer-events-none absolute inset-0" />
          <p className="relative text-ink-muted">Nenhum estabelecimento cadastrado ainda.</p>
        </div>
      ) : (
        [...grupos.entries()].map(([nomeCategoria, itens]) => (
          <section key={nomeCategoria} className="mt-10">
            <h2 className="font-display text-lg font-bold text-ink">{nomeCategoria}</h2>
            <div className="stagger mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {itens.map((estabelecimento) => (
                <EstabelecimentoCard key={estabelecimento.id} estabelecimento={estabelecimento} />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
