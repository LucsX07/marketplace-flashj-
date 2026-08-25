import Link from "next/link";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarTodosProdutosDoEstabelecimento } from "@/lib/produtos";
import ListaProdutosPainel from "./ListaProdutosPainel";

export default async function PainelProdutos() {
  const estabelecimento = await buscarMeuEstabelecimento();

  if (!estabelecimento) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="mt-4 text-black/60">
          Cadastre seu{" "}
          <Link href="/painel" className="underline">
            estabelecimento
          </Link>{" "}
          primeiro.
        </p>
      </main>
    );
  }

  const produtos = await listarTodosProdutosDoEstabelecimento(estabelecimento.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <p className="mt-1 text-black/60">Cadastre e gerencie o cardápio de {estabelecimento.nome}.</p>
      <ListaProdutosPainel estabelecimentoId={estabelecimento.id} produtosIniciais={produtos} />
    </main>
  );
}
