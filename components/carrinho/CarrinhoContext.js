"use client";

import { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionarItem(produto) {
    setItens((atual) => {
      // O carrinho é de um único estabelecimento por vez: adicionar um
      // produto de outro estabelecimento reinicia o carrinho.
      const deOutroEstabelecimento =
        atual.length > 0 && atual[0].estabelecimento_id !== produto.estabelecimento_id;
      const base = deOutroEstabelecimento ? [] : atual;

      const existente = base.find((item) => item.produto_id === produto.id);
      if (existente) {
        return base.map((item) =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [
        ...base,
        {
          produto_id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          estabelecimento_id: produto.estabelecimento_id,
        },
      ];
    });
  }

  function removerItem(produtoId) {
    setItens((atual) => atual.filter((item) => item.produto_id !== produtoId));
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
