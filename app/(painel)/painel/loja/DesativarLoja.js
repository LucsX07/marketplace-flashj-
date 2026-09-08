"use client";

import { useState, useTransition } from "react";
import { alternarLojaAtiva } from "@/lib/actions/estabelecimentos";
import { BOTAO_DESTRUTIVO, BOTAO_PRIMARIO, BOTAO_SECUNDARIO, CARTAO } from "@/lib/ui";

// "Fechar agora" é o expediente do dia. Isso aqui é outra coisa: tira a
// loja do ar por tempo indeterminado. Como as duas coisas moram na mesma
// tela, o texto tem que deixar a diferença bem clara — senão o comerciante
// desativa achando que só fechou pra almoçar.
export default function DesativarLoja({ estabelecimentoId, ativo }) {
  const [estaAtiva, setEstaAtiva] = useState(ativo);
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState(null);
  const [pendente, iniciarTransicao] = useTransition();

  function alternar(novoValor) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await alternarLojaAtiva(estabelecimentoId, novoValor);
      if (resultado?.erro) {
        setErro(resultado.erro);
        return;
      }
      setEstaAtiva(novoValor);
      setConfirmando(false);
    });
  }

  if (!estaAtiva) {
    return (
      <div className={`${CARTAO} animate-entrada mt-6 border-warn/40 p-4`}>
        <h2 className="font-semibold text-ink">Loja fora do ar</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Ninguém encontra sua loja na FlashJá e não é possível fazer pedidos.
          Seus produtos e o histórico de pedidos continuam guardados.
        </p>

        {erro && <p className="animate-entrada mt-3 text-sm text-warn">{erro}</p>}

        <button
          type="button"
          onClick={() => alternar(true)}
          disabled={pendente}
          className={`${BOTAO_PRIMARIO} mt-3 text-sm`}
        >
          {pendente ? "Reativando..." : "Colocar a loja no ar de novo"}
        </button>
      </div>
    );
  }

  return (
    <div className={`${CARTAO} animate-entrada mt-6 border-warn/40 p-4`}>
      <h2 className="font-semibold text-ink">Tirar a loja do ar</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Diferente de fechar por hoje: a loja some da vitrine e da busca, e
        ninguém consegue mais fazer pedidos. Produtos e histórico continuam
        guardados, e você pode voltar atrás quando quiser.
      </p>

      {erro && <p className="animate-entrada mt-3 text-sm text-warn">{erro}</p>}

      {confirmando ? (
        <div className="animate-entrada mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => alternar(false)}
            disabled={pendente}
            className={BOTAO_DESTRUTIVO}
          >
            {pendente ? "Tirando do ar..." : "Sim, tirar do ar"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            disabled={pendente}
            className={`${BOTAO_SECUNDARIO} text-sm`}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="mt-3 text-sm font-medium text-warn transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          Tirar minha loja do ar
        </button>
      )}
    </div>
  );
}
