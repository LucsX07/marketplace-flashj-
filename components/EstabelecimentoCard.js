"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";
import { CARTAO_INTERATIVO } from "@/lib/ui";
import { ITEM_ENTRADA, TOQUE_CARTAO } from "@/lib/motion";

export default function EstabelecimentoCard({ estabelecimento }) {
  return (
    <Link href={`/estabelecimentos/${estabelecimento.id}`} className="group block">
      <motion.div
        variants={ITEM_ENTRADA}
        whileTap={TOQUE_CARTAO}
        className={`${CARTAO_INTERATIVO} overflow-hidden`}
      >
        <div className="relative">
          <ImagemComPlaceholder
            src={estabelecimento.capa_url}
            alt={estabelecimento.nome}
            className="h-28 w-full"
          />
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-[var(--shadow-card)] ${
              estabelecimento.aberto_agora
                ? "bg-brand-tint text-brand"
                : "bg-warn-tint text-warn"
            }`}
          >
            {estabelecimento.aberto_agora ? "Aberto" : "Fechado"}
          </span>
        </div>

        <div className="p-4">
          {estabelecimento.categorias?.nome && (
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {estabelecimento.categorias.nome}
            </span>
          )}
          <h3 className="mt-1 font-display text-lg font-bold text-ink transition-colors duration-150 group-hover:text-brand">
            {estabelecimento.nome}
          </h3>
          {estabelecimento.descricao && (
            <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">
              {estabelecimento.descricao}
            </p>
          )}
          {estabelecimento.endereco && (
            <p className="mt-2 truncate text-xs text-ink-faint">{estabelecimento.endereco}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
