"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CAMPO } from "@/lib/ui";

// A busca vive na URL (/?busca=caderno) e não num estado da tela. Isso é de
// propósito: o resultado vira link que dá pra mandar pra alguém, o botão
// voltar do celular funciona, e quem procura produto precisa de uma consulta
// no servidor de qualquer jeito — não dá pra filtrar no navegador o que
// ainda não foi carregado.
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
        className={`${CAMPO} mt-0 min-w-0 flex-1`}
      />
      {termoDaUrl && (
        <button
          type="button"
          onClick={limpar}
          className="shrink-0 rounded-md border border-line px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
        >
          Limpar
        </button>
      )}
    </form>
  );
}
