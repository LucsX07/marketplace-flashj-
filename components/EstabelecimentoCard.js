"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";
import { CARTAO_INTERATIVO } from "@/lib/ui";
import { ITEM_ENTRADA, TOQUE_CARTAO } from "@/lib/motion";

// A categoria saiu de cima do nome. Rótulo em maiúsculo antes do título é um
// "eyebrow": ocupa a primeira linha, atrasa a informação que importa e faz
// toda loja começar igual. O nome carrega o próprio peso; a categoria virou
// metadado, junto do endereço.
export default function EstabelecimentoCard({ estabelecimento }) {
  const fechada = estabelecimento.aberto_agora === false;

  return (
    <Link href={`/estabelecimentos/${estabelecimento.id}`} className="group block">
      <motion.div
        variants={ITEM_ENTRADA}
        whileTap={TOQUE_CARTAO}
        className={`${CARTAO_INTERATIVO} flex gap-4 overflow-hidden p-3 sm:block sm:p-0`}
      >
        {/* No celular a capa é um quadrado ao lado do texto, não uma faixa
            por cima: cabem quatro lojas numa tela em vez de uma e meia. */}
        <ImagemComPlaceholder
          src={estabelecimento.capa_url}
          alt=""
          nome={estabelecimento.nome}
          className="h-20 w-20 shrink-0 rounded-lg sm:h-32 sm:w-full sm:rounded-none"
          sizes="(max-width: 640px) 80px, 320px"
        />

        <div className="min-w-0 flex-1 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display truncate text-lg font-bold tracking-tight text-ink transition-colors duration-150 group-hover:text-brand">
              {estabelecimento.nome}
            </h3>
            {fechada && (
              <span className="mt-0.5 shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                Fechada
              </span>
            )}
          </div>

          {estabelecimento.descricao && (
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-muted">
              {estabelecimento.descricao}
            </p>
          )}

          {/* Categoria e endereço numa linha só, no fim: é o que a pessoa
              confere depois de já ter lido o nome. */}
          <p className="mt-2 truncate text-xs text-ink-faint">
            {[estabelecimento.categorias?.nome, estabelecimento.endereco]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
