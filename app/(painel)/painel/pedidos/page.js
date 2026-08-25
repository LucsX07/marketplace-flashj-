import Link from "next/link";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarPedidosDoEstabelecimento } from "@/lib/pedidos";
import ListaPedidosPainel from "./ListaPedidosPainel";

export default async function PainelPedidos() {
  const estabelecimento = await buscarMeuEstabelecimento();

  if (!estabelecimento) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Pedidos recebidos</h1>
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

  const pedidos = await listarPedidosDoEstabelecimento(estabelecimento.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pedidos recebidos</h1>
      <ListaPedidosPainel pedidosIniciais={pedidos} />
    </main>
  );
}
