"use client";

import { useState, useTransition } from "react";
import { atualizarStatusPedido } from "@/lib/actions/pedidos";
import { STATUS_PEDIDO, STATUS_LABEL } from "@/lib/status-pedido";
import { formatarPreco } from "@/lib/formatar";
import StatusBadge from "@/components/StatusBadge";
import { BOTAO_PRIMARIO, BOTAO_SECUNDARIO } from "@/lib/ui";

const PROXIMO_STATUS = {
  [STATUS_PEDIDO.ACEITO]: STATUS_PEDIDO.EM_PREPARO,
  [STATUS_PEDIDO.EM_PREPARO]: STATUS_PEDIDO.PRONTO,
  [STATUS_PEDIDO.PRONTO]: STATUS_PEDIDO.CONCLUIDO,
};

export default function ListaPedidosPainel({ pedidosIniciais }) {
  const [pedidos, setPedidos] = useState(pedidosIniciais);
  const [versoes, setVersoes] = useState({});
  const [pendente, iniciarTransicao] = useTransition();

  function mudarStatus(id, status) {
    iniciarTransicao(async () => {
      const resultado = await atualizarStatusPedido(id, status);
      if (!resultado.erro) {
        setPedidos((atual) => atual.map((p) => (p.id === id ? { ...p, status } : p)));
        setVersoes((atual) => ({ ...atual, [id]: (atual[id] || 0) + 1 }));
      }
    });
  }

  if (pedidos.length === 0) {
    return (
      <p className="animate-entrada mt-4 text-ink-muted">
        Nenhum pedido ainda. Faça um pedido de teste como consumidor para ver aqui.
      </p>
    );
  }

  return (
    <ul className="stagger mt-6 space-y-4">
      {pedidos.map((pedido) => (
        <li
          key={pedido.id}
          className="animate-entrada rounded-md border border-line bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">Pedido #{pedido.id.slice(0, 8)}</span>
            <StatusBadge
              key={`${pedido.id}-${versoes[pedido.id] || 0}`}
              status={pedido.status}
              pulsar={Boolean(versoes[pedido.id])}
            />
          </div>
          <p className="text-sm text-ink-muted">
            {pedido.usuarios?.nome} · {pedido.usuarios?.telefone}
          </p>

          <ul className="mt-2 text-sm text-ink-muted">
            {pedido.itens_pedido.map((item, indice) => (
              <li key={indice}>
                {item.quantidade}x {item.produtos.nome}
                {item.item_pedido_opcoes?.length > 0 && (
                  <span className="text-xs text-ink-faint">
                    {" "}
                    ({item.item_pedido_opcoes.map((opcao) => opcao.nome_valor).join(", ")})
                  </span>
                )}
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
                  className={`${BOTAO_PRIMARIO} py-1.5 text-sm`}
                >
                  Aceitar
                </button>
                <button
                  disabled={pendente}
                  onClick={() => mudarStatus(pedido.id, STATUS_PEDIDO.RECUSADO)}
                  className={`${BOTAO_SECUNDARIO} py-1.5 text-sm`}
                >
                  Recusar
                </button>
              </>
            )}
            {PROXIMO_STATUS[pedido.status] && (
              <button
                disabled={pendente}
                onClick={() => mudarStatus(pedido.id, PROXIMO_STATUS[pedido.status])}
                className={`${BOTAO_SECUNDARIO} py-1.5 text-sm`}
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
