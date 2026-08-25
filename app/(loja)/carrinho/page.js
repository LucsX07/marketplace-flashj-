"use client";

import Link from "next/link";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, LINK_MARCA } from "@/lib/ui";

export default function PaginaCarrinho() {
  const { itens, removerItem, total } = useCarrinho();

  if (itens.length === 0) {
    return (
      <main className="animate-entrada mx-auto max-w-2xl px-4 py-10 sm:px-6">
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
    <main className="animate-entrada mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Carrinho</h1>

      <ul className="stagger mt-6 divide-y divide-line">
        {itens.map((item) => (
          <li
            key={item.produto_id}
            className="animate-entrada flex items-center justify-between py-3"
          >
            <div>
              <p className="font-medium text-ink">{item.nome}</p>
              <p className="text-sm text-ink-muted">Qtd: {item.quantidade}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-ink">{formatarPreco(item.preco * item.quantidade)}</span>
              <button
                onClick={() => removerItem(item.produto_id)}
                className="text-sm text-warn transition-transform duration-150 hover:underline active:scale-[0.97]"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="font-semibold text-ink">{formatarPreco(total)}</span>
      </div>

      <Link href="/checkout" className={`${BOTAO_PRIMARIO} mt-6 block text-center`}>
        Ir para o checkout
      </Link>
    </main>
  );
}
