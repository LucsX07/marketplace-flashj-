"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProdutoCard from "@/components/ProdutoCard";
import { LISTA_ENTRADA } from "@/lib/motion";

const TODOS = "Todos";

// Abas de categoria dentro da loja, a partir de `categoria_produto` (rótulo
// livre que o comerciante já preenche por produto) — sem taxonomia nova,
// só agrupa o que já existe. Loja sem nenhum produto categorizado não
// mostra abas nenhuma.
export default function GradeProdutosPorCategoria({ produtos }) {
  const categorias = useMemo(() => {
    const vistas = new Set();
    for (const produto of produtos) {
      if (produto.categoria_produto) vistas.add(produto.categoria_produto);
    }
    return [...vistas];
  }, [produtos]);

  const [ativa, setAtiva] = useState(TODOS);

  if (produtos.length === 0) {
    return (
      <p className="mt-8 text-ink-muted">Este estabelecimento ainda não adicionou produtos.</p>
    );
  }

  const filtrados = ativa === TODOS ? produtos : produtos.filter((p) => p.categoria_produto === ativa);

  return (
    <>
      {categorias.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {[TODOS, ...categorias].map((categoria) => (
            <motion.button
              key={categoria}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setAtiva(categoria)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                ativa === categoria
                  ? "border-brand bg-brand-tint text-brand"
                  : "border-line text-ink-muted hover:border-line-strong"
              }`}
            >
              {categoria}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={ativa}
          variants={LISTA_ENTRADA}
          initial="oculto"
          animate="visivel"
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {filtrados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
