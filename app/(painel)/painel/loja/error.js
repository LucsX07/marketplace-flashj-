"use client";

import { BOTAO_PRIMARIO } from "@/lib/ui";

export default function ErroMinhaLoja({ reset }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-ink">
        Não foi possível carregar sua loja
      </h1>
      <p className="mt-2 text-ink-muted">
        Pode ter sido uma falha de conexão. Tenta de novo em alguns segundos.
      </p>
      <button onClick={reset} className={`${BOTAO_PRIMARIO} mt-6`}>
        Tentar de novo
      </button>
    </main>
  );
}
