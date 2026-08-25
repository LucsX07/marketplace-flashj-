"use client";

import Link from "next/link";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";

export default function PaginaCarrinho() {
  const { itens, removerItem, total } = useCarrinho();

  if (itens.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Carrinho
        </h1>
        <p className="mt-4 text-ink-muted">Seu carrinho está vazio.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-brand hover:text-brand-hover">
          Ver estabelecimentos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Carrinho</h1>

      <ul className="mt-6 divide-y divide-line">
        {itens.map((item) => (
          <li key={item.produto_id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-ink">{item.nome}</p>
              <p className="text-sm text-ink-muted">Qtd: {item.quantidade}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-ink">{formatarPreco(item.preco * item.quantidade)}</span>
              <button
                onClick={() => removerItem(item.produto_id)}
                className="text-sm text-warn hover:underline"
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

      <Link
        href="/checkout"
        className="corner-cut mt-6 block rounded-sm bg-brand px-4 py-2 text-center font-semibold text-on-brand hover:bg-brand-hover"
      >
        Ir para o checkout
      </Link>
    </main>
  );
}
