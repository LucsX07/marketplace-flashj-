"use client";

import Link from "next/link";
import { useActionState, useTransition } from "react";
import { criarProduto, alternarDisponibilidade } from "@/lib/actions/produtos";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, CAMPO } from "@/lib/ui";

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
          <label className="block text-sm font-medium text-ink">Nome</label>
          <input name="nome" required className={CAMPO} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Descrição</label>
          <input name="descricao" className={CAMPO} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Preço (R$)</label>
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0"
            required
            className={`${CAMPO} w-28`}
          />
        </div>
        <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} text-sm`}>
          {pendente ? "Salvando..." : "Adicionar produto"}
        </button>
      </form>
      {estado?.erro && <p className="animate-entrada mt-2 text-sm text-warn">{estado.erro}</p>}

      {produtosIniciais.length === 0 ? (
        <p className="animate-entrada mt-8 text-ink-muted">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul className="stagger mt-8 divide-y divide-line">
          {produtosIniciais.map((produto) => (
            <li
              key={produto.id}
              className="animate-entrada flex items-center justify-between py-3"
            >
              <div>
                <span
                  className={`transition-colors duration-300 ${produto.disponivel ? "text-ink" : "text-ink-faint line-through"}`}
                >
                  {produto.nome}
                </span>
                <span className="ml-2 text-ink-muted">{formatarPreco(produto.preco)}</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/painel/produtos/${produto.id}`}
                  className="text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
                >
                  Editar
                </Link>
                <button
                  disabled={alternandoDisponibilidade}
                  onClick={() => alternar(produto.id, produto.disponivel)}
                  className="text-sm font-medium text-brand transition-transform duration-150 hover:text-brand-hover active:scale-[0.97] disabled:opacity-60"
                >
                  {produto.disponivel ? "Marcar indisponível" : "Marcar disponível"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
