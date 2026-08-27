"use client";

import Link from "next/link";
import { useActionState, useTransition } from "react";
import { criarProduto, alternarDisponibilidade } from "@/lib/actions/produtos";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, CAMPO, CARTAO } from "@/lib/ui";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";

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
      <form action={formAction} className={`${CARTAO} animate-entrada mt-6 flex flex-wrap items-end gap-3 p-4`}>
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
        <ul className={`${CARTAO} stagger mt-8 divide-y divide-line px-4`}>
          {produtosIniciais.map((produto) => (
            <li
              key={produto.id}
              className="animate-entrada flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ImagemComPlaceholder
                  src={produto.imagem_url}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-md"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`transition-colors duration-300 ${produto.disponivel ? "text-ink" : "text-ink-faint line-through"}`}
                    >
                      {produto.nome}
                    </span>
                    {produto.em_destaque && (
                      <span className="rounded-full bg-brand-tint px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                        Destaque
                      </span>
                    )}
                    {produto.preco_promocional && (
                      <span className="rounded-full bg-warn-tint px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warn">
                        Promoção
                      </span>
                    )}
                  </div>
                  <span className="text-ink-muted">
                    {produto.preco_promocional ? (
                      <>
                        <span className="mr-1 line-through">{formatarPreco(produto.preco)}</span>
                        {formatarPreco(produto.preco_promocional)}
                      </>
                    ) : (
                      formatarPreco(produto.preco)
                    )}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
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
