import Link from "next/link";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarTodosProdutosDoEstabelecimento } from "@/lib/produtos";
import ListaProdutosPainel from "./ListaProdutosPainel";

export default async function PainelProdutos() {
  const estabelecimento = await buscarMeuEstabelecimento();

  if (!estabelecimento) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Produtos
        </h1>
        <p className="mt-4 text-ink-muted">
          Cadastre seu{" "}
          <Link href="/painel" className="font-medium text-brand hover:text-brand-hover">
            estabelecimento
          </Link>{" "}
          primeiro.
        </p>
      </main>
    );
  }

  const produtos = await listarTodosProdutosDoEstabelecimento(estabelecimento.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Produtos</h1>
      <p className="mt-1 text-ink-muted">
        Cadastre e gerencie o cardápio de {estabelecimento.nome}.
      </p>
      <ListaProdutosPainel estabelecimentoId={estabelecimento.id} produtosIniciais={produtos} />
    </main>
  );
}
