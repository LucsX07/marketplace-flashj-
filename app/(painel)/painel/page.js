import Link from "next/link";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarCategorias } from "@/lib/categorias";
import FormularioEstabelecimento from "./FormularioEstabelecimento";

export default async function PainelInicial() {
  const estabelecimento = await buscarMeuEstabelecimento();

  if (!estabelecimento) {
    const categorias = await listarCategorias();
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Cadastre seu estabelecimento
        </h1>
        <p className="mt-1 text-ink-muted">
          Antes de gerenciar produtos e pedidos, cadastre a sua loja.
        </p>
        <FormularioEstabelecimento categorias={categorias} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Painel do Comerciante
      </h1>
      <p className="mt-1 text-ink-muted">Bem-vindo(a) de volta, {estabelecimento.nome}.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/painel/pedidos"
          className="rounded-md border border-line bg-surface p-4 transition hover:border-brand"
        >
          <h2 className="font-display font-bold text-ink">Pedidos recebidos</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Aceite, recuse e atualize o status dos pedidos.
          </p>
        </Link>
        <Link
          href="/painel/produtos"
          className="rounded-md border border-line bg-surface p-4 transition hover:border-brand"
        >
          <h2 className="font-display font-bold text-ink">Produtos</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Gerencie o cardápio do seu estabelecimento.
          </p>
        </Link>
      </div>
    </main>
  );
}
