"use client";

import Link from "next/link";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";

export default function PaginaCarrinho() {
  const { itens, removerItem, total } = useCarrinho();

  if (itens.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Carrinho</h1>
        <p className="mt-4 text-black/60">Seu carrinho está vazio.</p>
        <Link href="/" className="mt-4 inline-block underline">
          Ver estabelecimentos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Carrinho</h1>

      <ul className="mt-6 divide-y divide-black/10">
        {itens.map((item) => (
          <li key={item.produto_id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{item.nome}</p>
              <p className="text-sm text-black/60">Qtd: {item.quantidade}</p>
            </div>
            <div className="flex items-center gap-3">
              <span>{formatarPreco(item.preco * item.quantidade)}</span>
              <button
                onClick={() => removerItem(item.produto_id)}
                className="text-sm text-red-600 underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">{formatarPreco(total)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block rounded-md bg-black px-4 py-2 text-center text-white hover:bg-black/80"
      >
        Ir para o checkout
      </Link>
    </main>
  );
}
