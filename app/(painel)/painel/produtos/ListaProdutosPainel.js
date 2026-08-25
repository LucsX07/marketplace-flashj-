"use client";

import { useActionState, useTransition } from "react";
import { criarProduto, alternarDisponibilidade } from "@/lib/actions/produtos";
import { formatarPreco } from "@/lib/formatar";

const estadoInicial = { erro: null };
const campoClasse =
  "mt-1 rounded-md border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

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
          <label className="block text-sm font-medium text-ink">Nome</label>
          <input name="nome" required className={campoClasse} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Descrição</label>
          <input name="descricao" className={campoClasse} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Preço (R$)</label>
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0"
            required
            className={`${campoClasse} w-28`}
          />
        </div>
        <button
          type="submit"
          disabled={pendente}
          className="corner-cut rounded-sm bg-brand px-4 py-2 text-sm font-semibold text-on-brand disabled:opacity-60"
        >
          {pendente ? "Salvando..." : "Adicionar produto"}
        </button>
      </form>
      {estado?.erro && <p className="mt-2 text-sm text-warn">{estado.erro}</p>}

      {produtosIniciais.length === 0 ? (
        <p className="mt-8 text-ink-muted">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul className="mt-8 divide-y divide-line">
          {produtosIniciais.map((produto) => (
            <li key={produto.id} className="flex items-center justify-between py-3">
              <div>
                <span className={produto.disponivel ? "text-ink" : "text-ink-faint line-through"}>
                  {produto.nome}
                </span>
                <span className="ml-2 text-ink-muted">{formatarPreco(produto.preco)}</span>
              </div>
              <button
                disabled={alternandoDisponibilidade}
                onClick={() => alternar(produto.id, produto.disponivel)}
                className="text-sm font-medium text-brand hover:text-brand-hover disabled:opacity-60"
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
