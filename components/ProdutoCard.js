"use client";

import { useEffect, useState } from "react";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, CARTAO } from "@/lib/ui";
import SeletorDeOpcoesProduto from "@/components/SeletorDeOpcoesProduto";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";

export default function ProdutoCard({ produto }) {
  const { adicionarItem } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);
  const [seletorAberto, setSeletorAberto] = useState(false);

  useEffect(() => {
    if (!adicionado) return;
    const temporizador = setTimeout(() => setAdicionado(false), 900);
    return () => clearTimeout(temporizador);
  }, [adicionado]);

  const temOpcoes = produto.produto_opcoes?.length > 0;

  function confirmarAdicao(opcoesSelecionadas = [], precoFinal) {
    adicionarItem(produto, opcoesSelecionadas, precoFinal);
    setAdicionado(true);
    setSeletorAberto(false);
  }

  function lidarComClique() {
    if (temOpcoes) {
      setSeletorAberto(true);
      return;
    }
    confirmarAdicao();
  }

  return (
    <div className={`${CARTAO} animate-entrada overflow-hidden`}>
      <ImagemComPlaceholder
        src={produto.imagem_url}
        alt={produto.nome}
        className="h-36 w-full"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display line-clamp-2 font-bold text-ink">{produto.nome}</h3>
          {produto.em_destaque && (
            <span className="shrink-0 rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
              Destaque
            </span>
          )}
        </div>
        {produto.descricao && (
          <p className="line-clamp-2 text-sm text-ink-muted">{produto.descricao}</p>
        )}

        {produto.produto_atributos?.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-xs text-ink-faint">
            {produto.produto_atributos.map((atributo) => (
              <li key={atributo.id}>
                {atributo.nome}: {atributo.valor}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold text-ink">
            {temOpcoes && (
              <span className="mr-1 font-sans text-xs font-normal text-ink-faint">
                a partir de
              </span>
            )}
            {produto.preco_promocional ? (
              <>
                <span className="mr-1.5 font-sans text-xs font-normal text-ink-faint line-through">
                  {formatarPreco(produto.preco)}
                </span>
                {formatarPreco(produto.preco_promocional)}
              </>
            ) : (
              formatarPreco(produto.preco)
            )}
          </span>
          <button onClick={lidarComClique} className={`${BOTAO_PRIMARIO} py-1.5 text-sm`}>
            {adicionado ? "Adicionado ✓" : temOpcoes ? "Escolher" : "Adicionar"}
          </button>
        </div>
      </div>

      {seletorAberto && (
        <SeletorDeOpcoesProduto
          produto={produto}
          aoFechar={() => setSeletorAberto(false)}
          aoConfirmar={confirmarAdicao}
        />
      )}
    </div>
  );
}
