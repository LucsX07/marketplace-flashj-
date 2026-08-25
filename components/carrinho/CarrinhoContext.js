"use client";

import { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext(null);

// Dois tamanhos do mesmo produto são linhas diferentes no carrinho — a
// identidade de uma linha é o produto MAIS as opções escolhidas, não só o
// produto_id.
function montarChave(produtoId, opcoesSelecionadas) {
  const valoresIds = (opcoesSelecionadas || [])
    .map((opcao) => opcao.valor_id)
    .sort()
    .join(",");
  return `${produtoId}|${valoresIds}`;
}

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarItem(produto, opcoesSelecionadas = [], precoFinal) {
    const preco = precoFinal ?? produto.preco_promocional ?? produto.preco;
    const chave = montarChave(produto.id, opcoesSelecionadas);

    setItens((atual) => {
      // O carrinho é de um único estabelecimento por vez: adicionar um
      // produto de outro estabelecimento reinicia o carrinho.
      const deOutroEstabelecimento =
        atual.length > 0 && atual[0].estabelecimento_id !== produto.estabelecimento_id;
      const base = deOutroEstabelecimento ? [] : atual;

      const existente = base.find((item) => item.chave === chave);
      if (existente) {
        return base.map((item) =>
          item.chave === chave ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }

      return [
        ...base,
        {
          chave,
          produto_id: produto.id,
          nome: produto.nome,
          preco,
          quantidade: 1,
          estabelecimento_id: produto.estabelecimento_id,
          opcoes_selecionadas: opcoesSelecionadas,
        },
      ];
    });
  }

  function removerItem(chave) {
    setItens((atual) => atual.filter((item) => item.chave !== chave));
  }

  function limparCarrinho() {
    setItens([]);
  }

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarItem, removerItem, limparCarrinho, total }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) {
    throw new Error("useCarrinho precisa ser usado dentro de um CarrinhoProvider");
  }
  return contexto;
}
