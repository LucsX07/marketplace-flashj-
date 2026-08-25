"use client";

import { BOTAO_PRIMARIO } from "@/lib/ui";

export default function ErroGlobal({ error, reset }) {
  const naoConfigurado = error?.message?.includes("Supabase não configurado");

  return (
    <main className="animate-entrada mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {naoConfigurado ? "Falta configurar o Supabase" : "Algo deu errado"}
      </h1>
      <p className="mt-4 text-ink-muted">
        {naoConfigurado
          ? "Crie um projeto em supabase.com, copie a URL e a anon key em Project Settings > API, e cole no arquivo .env.local (veja o README)."
          : error?.message || "Tente novamente em instantes."}
      </p>
      <button onClick={reset} className={`${BOTAO_PRIMARIO} mt-6`}>
        Tentar de novo
      </button>
    </main>
  );
}
