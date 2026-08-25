import { notFound } from "next/navigation";
import ProdutoCard from "@/components/ProdutoCard";
import { buscarEstabelecimentoPorId } from "@/lib/estabelecimentos";
import { buscarProdutosPorEstabelecimento } from "@/lib/produtos";

export default async function PaginaEstabelecimento({ params }) {
  const { id } = await params;
  const estabelecimento = buscarEstabelecimentoPorId(id);

  if (!estabelecimento) {
    notFound();
  }

  const produtos = buscarProdutosPorEstabelecimento(id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <span className="text-xs font-medium uppercase text-black/40">
        {estabelecimento.categoria}
      </span>
      <h1 className="mt-1 text-2xl font-bold">{estabelecimento.nome}</h1>
      <p className="mt-1 text-black/60">{estabelecimento.descricao}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {produtos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </main>
  );
}
