"use client";

import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";

export default function ProdutoCard({ produto }) {
  const { adicionarItem } = useCarrinho();

  return (
    <div className="rounded-lg border border-black/10 p-4">
      <h3 className="font-semibold">{produto.nome}</h3>
      <p className="text-sm text-black/60">{produto.descricao}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-medium">{formatarPreco(produto.preco)}</span>
        <button
          onClick={() => adicionarItem(produto)}
          className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
