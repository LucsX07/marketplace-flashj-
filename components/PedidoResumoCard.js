import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatarPreco, formatarData } from "@/lib/formatar";

export default function PedidoResumoCard({ pedido }) {
  const totalItens = pedido.itens_pedido.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <li className="animate-entrada rounded-md border border-line bg-surface p-4 transition-[border-color,transform] duration-150 ease-out hover:border-line-strong active:scale-[0.99]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-ink">{pedido.estabelecimentos?.nome}</p>
          <p className="mt-0.5 text-xs text-ink-faint">
            Pedido #{pedido.id.slice(0, 8)} · {formatarData(pedido.criado_em)}
          </p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <p className="text-sm text-ink-muted">
          {totalItens} {totalItens === 1 ? "item" : "itens"} · {formatarPreco(pedido.total)}
        </p>
        <Link
          href={`/pedidos/${pedido.id}`}
          className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover"
        >
          Ver detalhes →
        </Link>
      </div>
    </li>
  );
}
