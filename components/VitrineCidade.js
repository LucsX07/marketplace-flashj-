"use client";

import { useMemo, useState } from "react";
import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import ProdutoCard from "@/components/ProdutoCard";
import { CAMPO } from "@/lib/ui";

function agruparPorCategoria(estabelecimentos) {
  const grupos = new Map();
  for (const estabelecimento of estabelecimentos) {
    const nomeCategoria = estabelecimento.categorias?.nome || "Outros";
    if (!grupos.has(nomeCategoria)) {
      grupos.set(nomeCategoria, []);
    }
    grupos.get(nomeCategoria).push(estabelecimento);
  }
  return grupos;
}

// Busca simples: filtra por nome entre os estabelecimentos já carregados
// dessa cidade — sem infraestrutura de busca nova, o catálogo por cidade
// ainda é pequeno o suficiente pra isso ser instantâneo.
export default function VitrineCidade({ estabelecimentos, destaques }) {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return estabelecimentos;
    return estabelecimentos.filter((estabelecimento) =>
      estabelecimento.nome.toLowerCase().includes(termo)
    );
  }, [busca, estabelecimentos]);

  const grupos = useMemo(() => agruparPorCategoria(filtrados), [filtrados]);

  return (
    <>
      <input
        type="search"
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
        placeholder="O que você está procurando?"
        className={`${CAMPO} mt-6 max-w-md`}
      />

      {destaques.length > 0 && !busca && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold text-ink">Destaques</h2>
          <div className="stagger mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {destaques.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        </section>
      )}

      {filtrados.length === 0 ? (
        <div className="animate-entrada relative mt-8 overflow-hidden rounded-md border border-line bg-surface p-10 text-center">
          <div className="grid-texture pointer-events-none absolute inset-0" />
          <p className="relative text-ink-muted">
            {busca
              ? "Nada encontrado com esse nome."
              : "A FlashJá ainda está chegando nessa cidade."}
          </p>
        </div>
      ) : (
        [...grupos.entries()].map(([nomeCategoria, itens]) => (
          <section key={nomeCategoria} className="mt-10">
            <h2 className="font-display text-lg font-bold text-ink">{nomeCategoria}</h2>
            <div className="stagger mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {itens.map((estabelecimento) => (
                <EstabelecimentoCard key={estabelecimento.id} estabelecimento={estabelecimento} />
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
