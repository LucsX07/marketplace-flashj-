import { notFound } from "next/navigation";
import ProdutoCard from "@/components/ProdutoCard";
import { buscarEstabelecimentoPorId } from "@/lib/estabelecimentos";
import { buscarProdutosPorEstabelecimento } from "@/lib/produtos";

export default async function PaginaEstabelecimento({ params }) {
  const { id } = await params;
  const estabelecimento = await buscarEstabelecimentoPorId(id);

  if (!estabelecimento) {
    notFound();
  }

  const produtos = await buscarProdutosPorEstabelecimento(id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {estabelecimento.categorias?.nome && (
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {estabelecimento.categorias.nome}
        </span>
      )}
      <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {estabelecimento.nome}
      </h1>
      <p className="mt-1 text-ink-muted">{estabelecimento.descricao}</p>

      {produtos.length === 0 ? (
        <p className="mt-8 text-ink-muted">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="stagger mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </main>
  );
}
