"use client";

import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";

export default function ProdutoCard({ produto }) {
  const { adicionarItem } = useCarrinho();

  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <h3 className="font-display font-bold text-ink">{produto.nome}</h3>
      <p className="text-sm text-ink-muted">{produto.descricao}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-medium text-ink">{formatarPreco(produto.preco)}</span>
        <button
          onClick={() => adicionarItem(produto)}
          className="corner-cut rounded-sm bg-brand px-3 py-1.5 text-sm font-semibold text-on-brand hover:bg-brand-hover"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
