"use client";

import { useEffect, useState } from "react";
import { listarPedidos, atualizarStatusPedido, STATUS_PEDIDO, STATUS_LABEL } from "@/lib/pedidos";

// Até termos login de comerciante (com Supabase Auth), fixamos o
// estabelecimento de exemplo para o qual este painel mostra os pedidos.
const ESTABELECIMENTO_DEMO_ID = "1";

const PROXIMO_STATUS = {
  [STATUS_PEDIDO.ACEITO]: STATUS_PEDIDO.EM_PREPARO,
  [STATUS_PEDIDO.EM_PREPARO]: STATUS_PEDIDO.PRONTO,
  [STATUS_PEDIDO.PRONTO]: STATUS_PEDIDO.CONCLUIDO,
};

export default function PainelPedidos() {
  const [pedidos, setPedidos] = useState([]);

  function carregar() {
    setPedidos(
      listarPedidos().filter((pedido) => pedido.estabelecimentoId === ESTABELECIMENTO_DEMO_ID)
    );
  }

  useEffect(() => {
    carregar();
  }, []);

  function mudarStatus(id, status) {
    atualizarStatusPedido(id, status);
    carregar();
  }

  if (pedidos.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Pedidos recebidos</h1>
        <p className="mt-4 text-black/60">
          Nenhum pedido ainda. Faça um pedido de teste como consumidor para ver aqui.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pedidos recebidos</h1>

      <ul className="mt-6 space-y-4">
        {pedidos.map((pedido) => (
          <li key={pedido.id} className="rounded-lg border border-black/10 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Pedido #{pedido.id.slice(0, 8)}</span>
              <span className="text-sm">{STATUS_LABEL[pedido.status]}</span>
            </div>
            <p className="text-sm text-black/60">
              {pedido.cliente?.nome} · {pedido.cliente?.telefone}
            </p>

            <ul className="mt-2 text-sm text-black/70">
              {pedido.itens.map((item) => (
                <li key={item.produtoId}>
                  {item.quantidade}x {item.nome}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-2">
              {pedido.status === STATUS_PEDIDO.PENDENTE && (
                <>
                  <button
                    onClick={() => mudarStatus(pedido.id, STATUS_PEDIDO.ACEITO)}
                    className="rounded-md bg-black px-3 py-1.5 text-sm text-white"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => mudarStatus(pedido.id, STATUS_PEDIDO.RECUSADO)}
                    className="rounded-md border border-black/20 px-3 py-1.5 text-sm"
                  >
                    Recusar
                  </button>
                </>
              )}
              {PROXIMO_STATUS[pedido.status] && (
                <button
                  onClick={() => mudarStatus(pedido.id, PROXIMO_STATUS[pedido.status])}
                  className="rounded-md border border-black/20 px-3 py-1.5 text-sm"
                >
                  Marcar como {STATUS_LABEL[PROXIMO_STATUS[pedido.status]]}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
