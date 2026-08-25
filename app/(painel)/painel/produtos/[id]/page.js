import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { buscarProdutoDoComerciante } from "@/lib/produtos";
import { sugestoesPara } from "@/lib/sugestoes-produto";
import FormularioProdutoDetalhado from "./FormularioProdutoDetalhado";

export default async function EditarProduto({ params }) {
  const { id } = await params;
  const estabelecimento = await buscarMeuEstabelecimento();
  if (!estabelecimento) notFound();

  const produto = await buscarProdutoDoComerciante(id);
  // Produtos são de leitura pública (RLS), então a busca acima não falha
  // por dono errado — a checagem de posse precisa ser explícita aqui.
  if (!produto || produto.estabelecimento_id !== estabelecimento.id) notFound();

  const sugestoes = sugestoesPara(estabelecimento.categorias?.nome);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/painel/produtos"
        className="text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
      >
        ← Produtos
      </Link>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink">
        {produto.nome}
      </h1>
      <p className="mt-1 text-ink-muted">
        Detalhes, atributos e opções que o consumidor vê ao abrir este produto.
      </p>
      <FormularioProdutoDetalhado produto={produto} sugestoes={sugestoes} />
    </main>
  );
}
