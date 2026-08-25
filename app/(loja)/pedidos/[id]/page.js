import { notFound } from "next/navigation";
import { buscarPedidoPorId } from "@/lib/pedidos";
import { STATUS_LABEL, STATUS_BADGE } from "@/lib/status-pedido";
import { formatarPreco } from "@/lib/formatar";

export default async function PaginaPedido({ params }) {
  const { id } = await params;
  const pedido = await buscarPedidoPorId(id);

  if (!pedido) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Pedido #{pedido.id.slice(0, 8)}
      </h1>
      <span
        className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${STATUS_BADGE[pedido.status]}`}
      >
        {STATUS_LABEL[pedido.status]}
      </span>

      <ul className="mt-6 divide-y divide-line">
        {pedido.itens_pedido.map((item, indice) => (
          <li key={indice} className="flex justify-between py-2 text-ink">
            <span>
              {item.quantidade}x {item.produtos.nome}
            </span>
            <span>{formatarPreco(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-ink">
        <span>Total</span>
        <span>{formatarPreco(pedido.total)}</span>
      </div>
    </main>
  );
}
