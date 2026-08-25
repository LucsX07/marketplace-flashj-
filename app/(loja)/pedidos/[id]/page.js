import { notFound } from "next/navigation";
import { buscarPedidoPorId } from "@/lib/pedidos";
import { STATUS_LABEL } from "@/lib/status-pedido";
import { formatarPreco } from "@/lib/formatar";

export default async function PaginaPedido({ params }) {
  const { id } = await params;
  const pedido = await buscarPedidoPorId(id);

  if (!pedido) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pedido #{pedido.id.slice(0, 8)}</h1>
      <p className="mt-2 text-lg">
        Status: <span className="font-semibold">{STATUS_LABEL[pedido.status]}</span>
      </p>

      <ul className="mt-6 divide-y divide-black/10">
        {pedido.itens_pedido.map((item, indice) => (
          <li key={indice} className="flex justify-between py-2">
            <span>
              {item.quantidade}x {item.produtos.nome}
            </span>
            <span>{formatarPreco(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-semibold">
        <span>Total</span>
        <span>{formatarPreco(pedido.total)}</span>
      </div>
    </main>
  );
}
