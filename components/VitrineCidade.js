"use client";

import { motion } from "framer-motion";
import EstabelecimentoCard from "@/components/EstabelecimentoCard";
import ProdutoCard from "@/components/ProdutoCard";
import { LISTA_ENTRADA } from "@/lib/motion";

// Agrupar por categoria parecia organização e era o contrário: numa cidade
// com uma loja por ramo, cada seção virava um título seguido de um card
// solitário, e o desktop ficava com três quartos da página vazios. Parecia
// defeito, não escolha.
//
// Agora é uma grade só, e a categoria vive dentro do card. Quando Granja
// tiver vinte lojas, a resposta é filtro — não voltar a picotar a página em
// seções que não enchem uma linha.
function Secao({ titulo, contagem, children }) {
  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
          {titulo}
        </h2>
        {contagem != null && (
          <span className="numerico text-sm text-ink-faint">{contagem}</span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function VitrineCidade({ estabelecimentos, destaques }) {
  if (estabelecimentos.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-line bg-surface px-6 py-14 text-center">
        <p className="font-display text-lg font-bold text-ink">
          A FlashJá ainda não chegou aqui
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
          Nenhuma loja desta cidade se cadastrou até agora. Se você tem um
          comércio, pode ser o primeiro.
        </p>
      </div>
    );
  }

  return (
    <>
      {destaques.length > 0 && (
        <Secao titulo="Em destaque">
          <motion.div
            variants={LISTA_ENTRADA}
            initial="oculto"
            animate="visivel"
            className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
          >
            {destaques.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} ocultarDestaque />
            ))}
          </motion.div>
        </Secao>
      )}

      <Secao
        titulo="Lojas da cidade"
        contagem={
          estabelecimentos.length === 1
            ? "1 loja"
            : `${estabelecimentos.length} lojas`
        }
      >
        <motion.div
          variants={LISTA_ENTRADA}
          initial="oculto"
          animate="visivel"
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {estabelecimentos.map((estabelecimento) => (
            <EstabelecimentoCard
              key={estabelecimento.id}
              estabelecimento={estabelecimento}
            />
          ))}
        </motion.div>
      </Secao>
    </>
  );
}
