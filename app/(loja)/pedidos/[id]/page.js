import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPedidoPorId } from "@/lib/pedidos";
import { STATUS_PAGAMENTO_LABEL, METODO_PAGAMENTO_LABEL } from "@/lib/status-pedido";
import { formatarPreco, formatarData } from "@/lib/formatar";
import StatusBadge from "@/components/StatusBadge";
import PedidoTimeline from "@/components/PedidoTimeline";

export default async function PaginaPedido({ params }) {
  const { id } = await params;
  const pedido = await buscarPedidoPorId(id);

  if (!pedido) {
    notFound();
  }

  const pagamento = pedido.pagamentos?.[0];

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/pedidos"
        className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
      >
        ← Meus pedidos
      </Link>

      <div className="animate-entrada mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            {pedido.estabelecimentos?.nome}
          </h1>
          <p className="mt-0.5 text-xs text-ink-faint">
            Pedido #{pedido.id.slice(0, 8)} · {formatarData(pedido.criado_em)}
          </p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <section className="animate-entrada mt-8 rounded-md border border-line bg-surface p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Acompanhamento
        </h2>
        <div className="mt-4">
          <PedidoTimeline status={pedido.status} />
        </div>
      </section>

      <section className="animate-entrada mt-6 rounded-md border border-line bg-surface p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Itens</h2>
        <ul className="mt-3 divide-y divide-line">
          {pedido.itens_pedido.map((item, indice) => (
            <li key={indice} className="py-2.5">
              <div className="flex justify-between text-sm text-ink">
                <span>
                  {item.quantidade}x {item.produtos.nome}
                </span>
                <span>{formatarPreco(item.subtotal)}</span>
              </div>
              <p className="text-xs text-ink-faint">
                {formatarPreco(item.preco_unitario)} cada
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
          <span>Total</span>
          <span>{formatarPreco(pedido.total)}</span>
        </div>
      </section>

      {pagamento && (
        <section className="animate-entrada mt-6 rounded-md border border-line bg-surface p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Pagamento
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Forma</dt>
              <dd className="text-ink">{METODO_PAGAMENTO_LABEL[pagamento.metodo]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Status</dt>
              <dd className="text-ink">{STATUS_PAGAMENTO_LABEL[pagamento.status]}</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  );
}
