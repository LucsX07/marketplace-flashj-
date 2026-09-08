"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusPedido } from "@/lib/actions/pedidos";
import { criarClienteNavegador } from "@/lib/supabase/browser";
import { STATUS_PEDIDO, STATUS_LABEL } from "@/lib/status-pedido";
import { formatarPreco } from "@/lib/formatar";
import StatusBadge from "@/components/StatusBadge";
import { BOTAO_PRIMARIO, BOTAO_SECUNDARIO, CARTAO } from "@/lib/ui";

const PROXIMO_STATUS = {
  [STATUS_PEDIDO.ACEITO]: STATUS_PEDIDO.EM_PREPARO,
  [STATUS_PEDIDO.EM_PREPARO]: STATUS_PEDIDO.PRONTO,
  [STATUS_PEDIDO.PRONTO]: STATUS_PEDIDO.CONCLUIDO,
};

// Bipe curto pra chamar atenção de quem não está olhando pra tela. Usa o
// próprio Web Audio (sem arquivo de som) e falha em silêncio se o navegador
// bloquear áudio antes de qualquer interação — o aviso visual continua.
function tocarAviso() {
  try {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return;
    const contexto = new Contexto();
    const oscilador = contexto.createOscillator();
    const volume = contexto.createGain();
    oscilador.connect(volume);
    volume.connect(contexto.destination);
    oscilador.frequency.value = 880;
    volume.gain.setValueAtTime(0.0001, contexto.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.2, contexto.currentTime + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.0001, contexto.currentTime + 0.35);
    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.36);
    oscilador.onended = () => contexto.close();
  } catch {
    // Áudio bloqueado pelo navegador — segue só com o aviso visual.
  }
}

// Escuta o Realtime do Supabase e recarrega os dados do servidor quando algo
// muda nos pedidos desta loja. Recarregar (em vez de montar o pedido a partir
// do payload) mantém uma fonte de verdade só: a consulta que já existe no
// Server Component, com cliente, itens e opções já juntos.
function useEscutarPedidos(estabelecimentoId) {
  const router = useRouter();
  const [novos, setNovos] = useState(0);

  useEffect(() => {
    if (!estabelecimentoId) return;

    const supabase = criarClienteNavegador();
    const canal = supabase
      .channel(`pedidos-${estabelecimentoId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pedidos",
          filter: `estabelecimento_id=eq.${estabelecimentoId}`,
        },
        () => {
          setNovos((atual) => atual + 1);
          tocarAviso();
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pedidos",
          filter: `estabelecimento_id=eq.${estabelecimentoId}`,
        },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [estabelecimentoId, router]);

  return { novos, limparNovos: () => setNovos(0) };
}

export default function ListaPedidosPainel({ pedidos, estabelecimentoId }) {
  const [versoes, setVersoes] = useState({});
  const [pendente, iniciarTransicao] = useTransition();
  const { novos, limparNovos } = useEscutarPedidos(estabelecimentoId);

  function mudarStatus(id, status) {
    iniciarTransicao(async () => {
      const resultado = await atualizarStatusPedido(id, status);
      if (!resultado.erro) {
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
    <>
      {novos > 0 && (
        <button
          type="button"
          onClick={limparNovos}
          className="animate-entrada mt-4 flex w-full items-center justify-between rounded-md border border-brand bg-brand-tint px-4 py-3 text-sm font-medium text-brand"
        >
          <span>
            {novos === 1 ? "Chegou 1 pedido novo" : `Chegaram ${novos} pedidos novos`} — já está na
            lista abaixo.
          </span>
          <span className="text-xs text-ink-faint">dispensar</span>
        </button>
      )}

      <ul className="stagger mt-6 space-y-4">
        {pedidos.map((pedido) => (
          <li key={pedido.id} className={`${CARTAO} animate-entrada p-4`}>
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
                    onClick={() => {
                      if (confirm("Recusar este pedido? Essa ação não pode ser desfeita.")) {
                        mudarStatus(pedido.id, STATUS_PEDIDO.RECUSADO);
                      }
                    }}
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
    </>
  );
}
