"use client";

import { useEffect, useState } from "react";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, CARTAO } from "@/lib/ui";

export default function ProdutoCard({ produto }) {
  const { adicionarItem } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    if (!adicionado) return;
    const temporizador = setTimeout(() => setAdicionado(false), 900);
    return () => clearTimeout(temporizador);
  }, [adicionado]);

  function lidarComClique() {
    adicionarItem(produto);
    setAdicionado(true);
  }

  return (
    <div className={`${CARTAO} animate-entrada p-4`}>
      <h3 className="font-display font-bold text-ink">{produto.nome}</h3>
      <p className="text-sm text-ink-muted">{produto.descricao}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-medium text-ink">{formatarPreco(produto.preco)}</span>
        <button onClick={lidarComClique} className={`${BOTAO_PRIMARIO} py-1.5 text-sm`}>
          {adicionado ? "Adicionado ✓" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}
