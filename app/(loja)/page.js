import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import { listarEstabelecimentos } from "@/lib/estabelecimentos";

export default async function PaginaInicial() {
  const estabelecimentos = await listarEstabelecimentos();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">FlashJá</h1>
      <p className="mt-1 text-black/60">Escolha um estabelecimento perto de você.</p>

      {estabelecimentos.length === 0 ? (
        <p className="mt-8 text-black/60">Nenhum estabelecimento cadastrado ainda.</p>
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
