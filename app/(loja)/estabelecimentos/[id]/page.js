import { notFound } from "next/navigation";
import GradeProdutosPorCategoria from "@/components/GradeProdutosPorCategoria";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";
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
    <main className="mx-auto max-w-3xl pb-10 sm:px-6 sm:py-10">
      <ImagemComPlaceholder
        src={estabelecimento.capa_url}
        alt={estabelecimento.nome}
        className="h-40 w-full sm:rounded-md sm:h-56"
        sizes="(max-width: 768px) 100vw, 768px"
      />

      <div className="px-4 sm:px-0">
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {estabelecimento.categorias?.nome && (
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {estabelecimento.categorias.nome}
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              estabelecimento.aberto_agora
                ? "bg-brand-tint text-brand"
                : "bg-warn-tint text-warn"
            }`}
          >
            {estabelecimento.aberto_agora ? "Aberto agora" : "Fechado agora"}
          </span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {estabelecimento.nome}
        </h1>
        <p className="mt-1 text-ink-muted">{estabelecimento.descricao}</p>

        <GradeProdutosPorCategoria produtos={produtos} />
      </div>
    </main>
  );
}
