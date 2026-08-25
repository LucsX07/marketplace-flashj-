import Link from "next/link";

export default function PainelInicial() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Painel do Comerciante</h1>
      <p className="mt-1 text-black/60">Bem-vindo(a) de volta, Padaria do Zé.</p>

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
