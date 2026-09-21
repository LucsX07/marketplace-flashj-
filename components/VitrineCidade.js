"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import ProdutoCard from "@/components/ProdutoCard";
import { ITEM_ENTRADA, LISTA_ENTRADA } from "@/lib/motion";

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

// A busca saiu daqui: ela agora mora na URL e consulta o servidor, porque
// precisa achar produto de qualquer loja — não dá pra filtrar no navegador
// o que nunca foi carregado. Ver CampoDeBusca e ResultadosDaBusca.
export default function VitrineCidade({ estabelecimentos, destaques }) {
  const grupos = useMemo(
    () => agruparPorCategoria(estabelecimentos),
    [estabelecimentos],
  );

  return (
    <>
      {destaques.length > 0 && (
        <section className="mt-10 border-b border-line pb-10">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-brand" />
            <h2 className="font-display text-xl font-bold text-ink">
              Destaques
            </h2>
          </div>
          <motion.div
            variants={LISTA_ENTRADA}
            initial="oculto"
            animate="visivel"
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            {destaques.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </motion.div>
        </section>
      )}

      {estabelecimentos.length === 0 ? (
        <motion.div
          initial={ITEM_ENTRADA.oculto}
          animate={ITEM_ENTRADA.visivel}
          className="relative mt-8 overflow-hidden rounded-md border border-line bg-surface p-10 text-center"
        >
          <div className="grid-texture pointer-events-none absolute inset-0" />
          <p className="relative text-ink-muted">
            A FlashJá ainda está chegando nessa cidade.
          </p>
        </motion.div>
      ) : (
        [...grupos.entries()].map(([nomeCategoria, itens]) => (
          <section key={nomeCategoria} className="mt-10">
            <h2 className="font-display text-lg font-bold text-ink">
              {nomeCategoria}
            </h2>
            <motion.div
              variants={LISTA_ENTRADA}
              initial="oculto"
              animate="visivel"
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
            >
              {itens.map((estabelecimento) => (
                <EstabelecimentoCard
                  key={estabelecimento.id}
                  estabelecimento={estabelecimento}
                />
              ))}
            </motion.div>
          </section>
        ))
      )}
    </>
  );
}
