import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPedidoPorId } from "@/lib/pedidos";
import { STATUS_PAGAMENTO_LABEL, METODO_PAGAMENTO_LABEL } from "@/lib/status-pedido";
import { formatarPreco, formatarData } from "@/lib/formatar";
import { CARTAO } from "@/lib/ui";
import StatusBadge from "@/components/StatusBadge";
import PedidoTimeline from "@/components/PedidoTimeline";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";

export default async function PaginaPedido({ params, searchParams }) {
  const { id } = await params;
  const { novo } = await searchParams;
  const pedido = await buscarPedidoPorId(id);

  if (!pedido) {
    notFound();
  }

  const pagamento = pedido.pagamentos?.[0];

  return (
    <main className="mx-auto max-w-2xl pb-10 sm:px-6 sm:py-10">
      <div className="px-4 sm:px-0">
        <Link
          href="/pedidos"
          className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
        >
          ← Meus pedidos
        </Link>

        {novo === "1" && (
          <div className="animate-entrada mt-4 rounded-md border border-brand bg-brand-tint px-4 py-3 text-sm font-medium text-brand">
            Pedido confirmado 🎉 Acompanhe o andamento aqui.
          </div>
        )}
      </div>

      <div className="animate-entrada mt-4 overflow-hidden sm:rounded-md">
        <ImagemComPlaceholder
          src={pedido.estabelecimentos?.capa_url}
          alt={pedido.estabelecimentos?.nome || ""}
          className="h-32 w-full"
        />
      </div>

      <div className="px-4 sm:px-0">
        <div className="animate-entrada mt-4 flex flex-wrap items-center justify-between gap-3">
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

        <section className={`${CARTAO} animate-entrada mt-8 p-4`}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Acompanhamento
          </h2>
          <div className="mt-4">
            <PedidoTimeline status={pedido.status} />
          </div>
        </section>

        <section className={`${CARTAO} animate-entrada mt-4 p-4`}>
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
                {item.item_pedido_opcoes?.length > 0 && (
                  <p className="text-xs text-ink-faint">
                    {item.item_pedido_opcoes.map((opcao) => opcao.nome_valor).join(", ")}
                  </p>
                )}
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
          <section className={`${CARTAO} animate-entrada mt-4 p-4`}>
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
      </div>
    </main>
  );
}
