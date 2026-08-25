"use client";

import { useState, useTransition } from "react";
import { alternarAbertoAgora } from "@/lib/actions/estabelecimentos";

export default function AbrirFecharLoja({ estabelecimentoId, abertoAgora }) {
  const [aberto, setAberto] = useState(abertoAgora);
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    const novoValor = !aberto;
    iniciarTransicao(async () => {
      const resultado = await alternarAbertoAgora(estabelecimentoId, novoValor);
      if (!resultado?.erro) {
        setAberto(novoValor);
      }
    });
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-line bg-surface p-4">
      <div>
        <p className="text-sm font-medium text-ink">Status da loja</p>
        <p className="text-xs text-ink-muted">
          {aberto ? "🟢 Aberta agora — consumidores podem comprar" : "🔴 Fechada agora"}
        </p>
      </div>
      <button
        type="button"
        onClick={alternar}
        disabled={pendente}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 disabled:opacity-60 ${
          aberto ? "bg-brand-tint text-brand" : "bg-warn-tint text-warn"
        }`}
      >
        {pendente ? "..." : aberto ? "Fechar loja" : "Abrir loja"}
      </button>
    </div>
  );
}
