"use client";

import { useActionState, useEffect, useRef } from "react";
import { atualizarPerfil } from "@/lib/actions/perfil";
import { BOTAO_PRIMARIO, CAMPO, CARTAO } from "@/lib/ui";

const estadoInicial = { erro: null, sucesso: false };

export default function FormularioPerfil({ nome, telefone }) {
  const [estado, formAction, pendente] = useActionState(
    atualizarPerfil,
    estadoInicial,
  );
  const avisoRef = useRef(null);

  // Depois de salvar, leva o foco pro aviso: quem usa leitor de tela não vê
  // o "Salvo" aparecer, e num celular ele pode estar fora da área visível.
  useEffect(() => {
    if (estado?.sucesso) {
      avisoRef.current?.focus();
    }
  }, [estado?.sucesso]);

  return (
    <form action={formAction} className={`${CARTAO} animate-entrada p-4`}>
      <h2 className="font-display font-bold text-ink">Meus dados</h2>

      <div className="mt-3">
        <label htmlFor="nome" className="block text-sm font-medium text-ink">
          Nome
        </label>
        <input
          id="nome"
          name="nome"
          defaultValue={nome ?? ""}
          required
          minLength={2}
          autoComplete="name"
          className={CAMPO}
        />
      </div>

      <div className="mt-3">
        <label
          htmlFor="telefone"
          className="block text-sm font-medium text-ink"
        >
          Telefone{" "}
          <span className="font-normal text-ink-faint">(opcional)</span>
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          defaultValue={telefone ?? ""}
          autoComplete="tel"
          className={CAMPO}
        />
        <p className="mt-1 text-xs text-ink-muted">
          É por aqui que o estabelecimento fala com você sobre o pedido.
        </p>
      </div>

      {estado?.erro && (
        <p className="animate-entrada mt-3 text-sm text-warn">{estado.erro}</p>
      )}
      {estado?.sucesso && (
        <p
          ref={avisoRef}
          tabIndex={-1}
          className="animate-entrada mt-3 text-sm font-medium text-brand outline-none"
        >
          Dados salvos.
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className={`${BOTAO_PRIMARIO} mt-4 text-sm`}
      >
        {pendente ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
