"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, LINK_MARCA } from "@/lib/ui";
import { ITEM_ENTRADA, LISTA_ENTRADA, TOQUE_BOTAO } from "@/lib/motion";

export default function PaginaCarrinho() {
  const { itens, removerItem, total } = useCarrinho();

  if (itens.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Carrinho
        </h1>
        <p className="mt-4 text-ink-muted">Seu carrinho está vazio.</p>
        <Link href="/" className={`${LINK_MARCA} mt-4 inline-block`}>
          Ver estabelecimentos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Carrinho</h1>

      <motion.ul
        variants={LISTA_ENTRADA}
        initial="oculto"
        animate="visivel"
        className="mt-6 divide-y divide-line"
      >
        <AnimatePresence initial={false}>
          {itens.map((item) => (
            <motion.li
              key={item.chave}
              layout
              variants={ITEM_ENTRADA}
              exit="saida"
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="font-medium text-ink">{item.nome}</p>
                {item.opcoes_selecionadas?.length > 0 && (
                  <p className="text-xs text-ink-faint">
                    {item.opcoes_selecionadas.map((opcao) => opcao.valor_nome).join(", ")}
                  </p>
                )}
                <p className="text-sm text-ink-muted">Qtd: {item.quantidade}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink">{formatarPreco(item.preco * item.quantidade)}</span>
                <motion.button
                  whileTap={TOQUE_BOTAO}
                  onClick={() => removerItem(item.chave)}
                  className="text-sm text-warn hover:underline"
                >
                  Remover
                </motion.button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="font-semibold text-ink">{formatarPreco(total)}</span>
      </div>

      <motion.div whileTap={TOQUE_BOTAO}>
        <Link href="/checkout" className={`${BOTAO_PRIMARIO} mt-6 block text-center`}>
          Ir para o checkout
        </Link>
      </motion.div>
    </main>
  );
}
