"use client";

import { motion } from "framer-motion";
import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import ProdutoCard from "@/components/ProdutoCard";
import { ITEM_ENTRADA, LISTA_ENTRADA } from "@/lib/motion";

function Secao({ titulo, children }) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-brand" />
        <h2 className="font-display text-lg font-bold text-ink">{titulo}</h2>
      </div>
      <motion.div
        variants={LISTA_ENTRADA}
        initial="oculto"
        animate="visivel"
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function ResultadosDaBusca({
  termo,
  produtos,
  estabelecimentos,
}) {
  const quantidade = produtos.length + estabelecimentos.length;

  if (quantidade === 0) {
    return (
      <motion.div
        initial={ITEM_ENTRADA.oculto}
        animate={ITEM_ENTRADA.visivel}
        className="relative mt-8 overflow-hidden rounded-md border border-line bg-surface p-10 text-center"
      >
        <p className="font-medium text-ink">
          Nada encontrado para “{termo}”.
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Tente outra palavra, ou veja as lojas da sua cidade abaixo.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <p className="mt-6 text-sm text-ink-muted" role="status">
        {quantidade === 1 ? "1 resultado" : `${quantidade} resultados`} para “
        {termo}”.
      </p>

      {/* Produto vem antes de loja: quem digita "caderno" quer o caderno, e a
          loja é o meio de conseguir ele. Quem procurou a loja pelo nome acha
          ela logo abaixo, e são poucas. */}
      {produtos.length > 0 && (
        <Secao titulo={produtos.length === 1 ? "Produto" : "Produtos"}>
          {produtos.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              mostrarLoja
              lojaFechada={produto.estabelecimentos?.aberto_agora === false}
            />
          ))}
        </Secao>
      )}

      {estabelecimentos.length > 0 && (
        <Secao titulo={estabelecimentos.length === 1 ? "Loja" : "Lojas"}>
          {estabelecimentos.map((estabelecimento) => (
            <EstabelecimentoCard
              key={estabelecimento.id}
              estabelecimento={estabelecimento}
            />
          ))}
        </Secao>
      )}
    </>
  );
}
