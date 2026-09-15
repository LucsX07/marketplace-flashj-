"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteNavegador } from "@/lib/supabase/browser";

const TEMPO_DO_AVISO = 8000;

// Espelho do que o painel do comerciante faz: lá o aviso é "chegou pedido",
// aqui é "seu pedido andou". Sem isso, quem está esperando o pedido ficar
// pronto precisa recarregar a página na mão pra descobrir — e é exatamente
// nessa tela que a pessoa fica parada olhando.
//
// Recarrega os dados do servidor em vez de montar o pedido a partir do
// payload: mantém uma fonte de verdade só, a consulta que já existe na
// página, com loja, itens e pagamento juntos.
export default function EscutarMeuPedido({ pedidoId, statusAtual }) {
  const router = useRouter();
  const [mudou, setMudou] = useState(false);
  const temporizadorRef = useRef(null);

  // O status vive num ref, não nas dependências do efeito: se entrasse lá, o
  // canal seria derrubado e reaberto a cada mudança de status, e uma segunda
  // mudança logo em seguida poderia chegar no intervalo em que não há canal.
  const statusRef = useRef(statusAtual);
  useEffect(() => {
    statusRef.current = statusAtual;
  }, [statusAtual]);

  useEffect(() => {
    const supabase = criarClienteNavegador();
    const canal = supabase
      .channel(`meu-pedido-${pedidoId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pedidos",
          filter: `id=eq.${pedidoId}`,
        },
        (payload) => {
          // O comerciante mexendo em outra coisa do pedido não é novidade
          // pra quem está esperando — só a mudança de situação importa.
          if (payload.new?.status === statusRef.current) return;

          setMudou(true);
          router.refresh();

          // O aviso se apaga sozinho: é um "olha, mudou agora", não um
          // recado permanente — a linha do tempo abaixo é que fica.
          clearTimeout(temporizadorRef.current);
          temporizadorRef.current = setTimeout(
            () => setMudou(false),
            TEMPO_DO_AVISO,
          );
        },
      )
      .subscribe();

    return () => {
      clearTimeout(temporizadorRef.current);
      supabase.removeChannel(canal);
    };
  }, [pedidoId, router]);

  if (!mudou) return null;

  return (
    <p
      role="status"
      className="animate-entrada mt-3 text-sm font-medium text-brand"
    >
      Seu pedido acabou de mudar de situação.
    </p>
  );
}
