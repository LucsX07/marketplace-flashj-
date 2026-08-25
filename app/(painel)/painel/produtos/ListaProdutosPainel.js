"use client";

import { useActionState, useTransition } from "react";
import { criarProduto, alternarDisponibilidade } from "@/lib/actions/produtos";
import { formatarPreco } from "@/lib/formatar";

const estadoInicial = { erro: null };

export default function ListaProdutosPainel({ estabelecimentoId, produtosIniciais }) {
  const criarProdutoComEstabelecimento = criarProduto.bind(null, estabelecimentoId);
  const [estado, formAction, pendente] = useActionState(
    criarProdutoComEstabelecimento,
    estadoInicial
  );
  const [alternandoDisponibilidade, iniciarTransicao] = useTransition();

  function alternar(produtoId, disponivelAtual) {
    iniciarTransicao(async () => {
      await alternarDisponibilidade(produtoId, !disponivelAtual);
    });
  }

  return (
    <>
      <form action={formAction} className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            name="nome"
            required
            className="mt-1 rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Descrição</label>
          <input name="descricao" className="mt-1 rounded-md border border-black/20 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Preço (R$)</label>
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0"
            required
            className="mt-1 w-28 rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={pendente}
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-black/80 disabled:opacity-60"
        >
          {pendente ? "Salvando..." : "Adicionar produto"}
        </button>
      </form>
      {estado?.erro && <p className="mt-2 text-sm text-red-600">{estado.erro}</p>}

      {produtosIniciais.length === 0 ? (
        <p className="mt-8 text-black/60">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul className="mt-8 divide-y divide-black/10">
          {produtosIniciais.map((produto) => (
            <li key={produto.id} className="flex items-center justify-between py-3">
              <div>
                <span className={produto.disponivel ? "" : "text-black/40 line-through"}>
                  {produto.nome}
                </span>
                <span className="ml-2 text-black/60">{formatarPreco(produto.preco)}</span>
              </div>
              <button
                disabled={alternandoDisponibilidade}
                onClick={() => alternar(produto.id, produto.disponivel)}
                className="text-sm underline disabled:opacity-60"
              >
                {produto.disponivel ? "Marcar indisponível" : "Marcar disponível"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
