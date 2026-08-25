import Link from "next/link";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarCategorias } from "@/lib/categorias";
import FormularioEstabelecimento from "./FormularioEstabelecimento";

export default async function PainelInicial() {
  const estabelecimento = await buscarMeuEstabelecimento();

  if (!estabelecimento) {
    const categorias = await listarCategorias();
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Cadastre seu estabelecimento</h1>
        <p className="mt-1 text-black/60">
          Antes de gerenciar produtos e pedidos, cadastre a sua loja.
        </p>
        <FormularioEstabelecimento categorias={categorias} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Painel do Comerciante</h1>
      <p className="mt-1 text-black/60">Bem-vindo(a) de volta, {estabelecimento.nome}.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/painel/pedidos"
          className="rounded-lg border border-black/10 p-4 hover:shadow-md"
        >
          <h2 className="font-semibold">Pedidos recebidos</h2>
          <p className="text-sm text-black/60">
            Aceite, recuse e atualize o status dos pedidos.
          </p>
        </Link>
        <Link
          href="/painel/produtos"
          className="rounded-lg border border-black/10 p-4 hover:shadow-md"
        >
          <h2 className="font-semibold">Produtos</h2>
          <p className="text-sm text-black/60">Gerencie o cardápio do seu estabelecimento.</p>
        </Link>
      </div>
    </main>
  );
}
