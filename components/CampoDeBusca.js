"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CAMPO } from "@/lib/ui";

// A busca vive na URL (/?busca=caderno) e não num estado da tela. Isso é de
// propósito: o resultado vira link que dá pra mandar pra alguém, o botão
// voltar do celular funciona, e quem procura produto precisa de uma consulta
// no servidor de qualquer jeito — não dá pra filtrar no navegador o que
// ainda não foi carregado.
// O campo mora dentro da faixa de grafite da home: o input claro se destaca
// de propósito, mas o botão ao lado sai da paleta do bloco escuro, senão
// ficaria ilegível sobre ele.
export default function CampoDeBusca() {
  const router = useRouter();
  const termoDaUrl = useSearchParams().get("busca") || "";
  const [termo, setTermo] = useState(termoDaUrl);

  function procurar(evento) {
    evento.preventDefault();
    const limpo = termo.trim();
    router.push(limpo ? `/?busca=${encodeURIComponent(limpo)}` : "/");
  }

  function limpar() {
    setTermo("");
    router.push("/");
  }

  return (
    <form
      onSubmit={procurar}
      role="search"
      className="mt-6 flex max-w-md gap-2"
    >
      <label htmlFor="busca" className="sr-only">
        Buscar produto ou loja
      </label>
      <input
        id="busca"
        name="busca"
        type="search"
        value={termo}
        onChange={(evento) => setTermo(evento.target.value)}
        placeholder="Buscar produto ou loja"
        className={`${CAMPO} mt-0 min-w-0 flex-1 rounded-lg border-transparent shadow-[var(--shadow-card)]`}
      />
      {termoDaUrl && (
        <button
          type="button"
          onClick={limpar}
          className="shrink-0 rounded-lg border border-on-graphite-muted/30 px-3 text-sm font-medium text-on-graphite-muted transition-colors duration-150 hover:border-on-graphite-muted/60 hover:text-on-graphite"
        >
          Limpar
        </button>
      )}
    </form>
  );
}
