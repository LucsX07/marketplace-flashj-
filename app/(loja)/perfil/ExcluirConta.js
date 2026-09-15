"use client";

import { useState, useTransition } from "react";
import { excluirMinhaConta } from "@/lib/actions/perfil";
import { BOTAO_DESTRUTIVO, BOTAO_SECUNDARIO, CARTAO } from "@/lib/ui";

const CONFIRMACAO = "EXCLUIR";

// Diferente das outras ações destrutivas do app (dois toques), aqui pedimos
// a palavra escrita. Não é frescura: excluir a conta é a única coisa que a
// pessoa não consegue desfazer sozinha depois, nem pedindo pro suporte.
export default function ExcluirConta() {
  const [abriu, setAbriu] = useState(false);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState(null);
  const [pendente, iniciarTransicao] = useTransition();

  const podeExcluir = texto.trim().toUpperCase() === CONFIRMACAO;

  function excluir() {
    setErro(null);
    iniciarTransicao(async () => {
      // Em caso de sucesso a action desloga e redireciona; nada volta pra cá.
      const resultado = await excluirMinhaConta();
      if (resultado?.erro) setErro(resultado.erro);
    });
  }

  return (
    <div className={`${CARTAO} animate-entrada border-warn/40 p-4`}>
      <h2 className="font-display font-bold text-ink">Excluir minha conta</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Seus dados pessoais saem da FlashJá e você não consegue mais entrar. Os
        pedidos que você já fez continuam no histórico do estabelecimento, mas
        sem seu nome nem seu telefone — é o registro da venda dele.
      </p>

      {erro && <p className="animate-entrada mt-3 text-sm text-warn">{erro}</p>}

      {abriu ? (
        <div className="animate-entrada mt-3">
          <label
            htmlFor="confirmacao-exclusao"
            className="block text-sm text-ink"
          >
            Para confirmar, escreva <strong>{CONFIRMACAO}</strong> abaixo:
          </label>
          <input
            id="confirmacao-exclusao"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            autoComplete="off"
            className="mt-1 w-full max-w-[16rem] rounded-md border border-line bg-surface px-3 py-2 text-ink transition-colors duration-150 focus:border-warn focus:outline-none focus:ring-1 focus:ring-warn"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={excluir}
              disabled={!podeExcluir || pendente}
              className={BOTAO_DESTRUTIVO}
            >
              {pendente ? "Excluindo..." : "Excluir minha conta"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAbriu(false);
                setTexto("");
              }}
              disabled={pendente}
              className={`${BOTAO_SECUNDARIO} text-sm`}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAbriu(true)}
          className="mt-3 text-sm font-medium text-warn transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          Quero excluir minha conta
        </button>
      )}
    </div>
  );
}
