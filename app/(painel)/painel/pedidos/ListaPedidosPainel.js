"use client";

import { useState, useTransition } from "react";
import { atualizarStatusPedido } from "@/lib/actions/pedidos";
import { STATUS_PEDIDO, STATUS_LABEL, STATUS_BADGE } from "@/lib/status-pedido";
import { formatarPreco } from "@/lib/formatar";

const PROXIMO_STATUS = {
  [STATUS_PEDIDO.ACEITO]: STATUS_PEDIDO.EM_PREPARO,
  [STATUS_PEDIDO.EM_PREPARO]: STATUS_PEDIDO.PRONTO,
  [STATUS_PEDIDO.PRONTO]: STATUS_PEDIDO.CONCLUIDO,
};

export default function ListaPedidosPainel({ pedidosIniciais }) {
  const [pedidos, setPedidos] = useState(pedidosIniciais);
  const [pendente, iniciarTransicao] = useTransition();

  function mudarStatus(id, status) {
    iniciarTransicao(async () => {
      const resultado = await atualizarStatusPedido(id, status);
      if (!resultado.erro) {
        setPedidos((atual) => atual.map((p) => (p.id === id ? { ...p, status } : p)));
      }
    });
  }

  if (pedidos.length === 0) {
    return (
      <p className="mt-4 text-ink-muted">
        Nenhum pedido ainda. Faça um pedido de teste como consumidor para ver aqui.
      </p>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {pedidos.map((pedido) => (
        <li key={pedido.id} className="rounded-md border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Pedido #{pedido.id.slice(0, 8)}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[pedido.status]}`}
            >
              {STATUS_LABEL[pedido.status]}
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            {pedido.usuarios?.nome} · {pedido.usuarios?.telefone}
          </p>

          <ul className="mt-2 text-sm text-ink-muted">
            {pedido.itens_pedido.map((item, indice) => (
              <li key={indice}>
                {item.quantidade}x {item.produtos.nome}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-sm font-medium text-ink">{formatarPreco(pedido.total)}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {pedido.status === STATUS_PEDIDO.PENDENTE && (
              <>
                <button
                  disabled={pendente}
                  onClick={() => mudarStatus(pedido.id, STATUS_PEDIDO.ACEITO)}
                  className="corner-cut rounded-sm bg-brand px-3 py-1.5 text-sm font-semibold text-on-brand disabled:opacity-60"
                >
                  Aceitar
                </button>
                <button
                  disabled={pendente}
                  onClick={() => mudarStatus(pedido.id, STATUS_PEDIDO.RECUSADO)}
                  className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:border-line-strong disabled:opacity-60"
                >
                  Recusar
                </button>
              </>
            )}
            {PROXIMO_STATUS[pedido.status] && (
              <button
                disabled={pendente}
                onClick={() => mudarStatus(pedido.id, PROXIMO_STATUS[pedido.status])}
                className="rounded-md border border-line px-3 py-1.5 text-sm text-ink hover:border-line-strong disabled:opacity-60"
              >
                Marcar como {STATUS_LABEL[PROXIMO_STATUS[pedido.status]]}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
