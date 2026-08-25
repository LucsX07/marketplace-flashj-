"use client";

import { useState } from "react";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, BOTAO_SECUNDARIO } from "@/lib/ui";

// Modal de seleção de variação — aberto pelo ProdutoCard quando o produto
// tem opções (tamanho, adicionais...). Devolve pro chamador a lista de
// opções escolhidas e o preço final já com os ajustes somados.
export default function SeletorDeOpcoesProduto({ produto, aoConfirmar, aoFechar }) {
  const precoBase = produto.preco_promocional ?? produto.preco;
  const [selecoes, setSelecoes] = useState({});

  function selecionarUnica(opcaoId, valorId) {
    setSelecoes((atual) => ({ ...atual, [opcaoId]: valorId }));
  }

  function alternarMultipla(opcaoId, valorId) {
    setSelecoes((atual) => {
      const atuais = atual[opcaoId] || [];
      const jaSelecionado = atuais.includes(valorId);
      return {
        ...atual,
        [opcaoId]: jaSelecionado
          ? atuais.filter((id) => id !== valorId)
          : [...atuais, valorId],
      };
    });
  }

  const opcoesSelecionadas = produto.produto_opcoes.flatMap((opcao) => {
    const selecaoDaOpcao = selecoes[opcao.id];
    const valoresIds =
      opcao.tipo === "multipla" ? selecaoDaOpcao || [] : selecaoDaOpcao ? [selecaoDaOpcao] : [];
    return opcao.produto_opcao_valores
      .filter((valor) => valoresIds.includes(valor.id))
      .map((valor) => ({
        opcao_id: opcao.id,
        opcao_nome: opcao.nome,
        valor_id: valor.id,
        valor_nome: valor.nome,
        ajuste_preco: Number(valor.ajuste_preco),
      }));
  });

  const ajusteTotal = opcoesSelecionadas.reduce((soma, item) => soma + item.ajuste_preco, 0);
  const precoFinal = Number(precoBase) + ajusteTotal;

  const obrigatoriasPendentes = produto.produto_opcoes.filter(
    (opcao) => opcao.obrigatoria && !opcoesSelecionadas.some((item) => item.opcao_id === opcao.id)
  );
  const podeAdicionar = obrigatoriasPendentes.length === 0;

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 sm:items-center"
      onClick={aoFechar}
    >
      <div
        className="animate-entrada max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-md border border-line bg-surface p-5 sm:rounded-md"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-ink">{produto.nome}</h2>
            {produto.descricao && (
              <p className="mt-1 text-sm text-ink-muted">{produto.descricao}</p>
            )}
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="shrink-0 text-lg text-ink-faint transition-colors duration-150 hover:text-ink"
          >
            ✕
          </button>
        </div>

        {produto.produto_atributos?.length > 0 && (
          <ul className="mt-3 space-y-0.5 text-sm text-ink-muted">
            {produto.produto_atributos.map((atributo) => (
              <li key={atributo.id}>
                <span className="text-ink">{atributo.nome}:</span> {atributo.valor}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 space-y-5">
          {produto.produto_opcoes.map((opcao) => (
            <div key={opcao.id}>
              <p className="text-sm font-semibold text-ink">
                {opcao.nome}
                {opcao.obrigatoria && <span className="text-warn"> *</span>}
              </p>
              <div className="mt-2 space-y-2">
                {opcao.produto_opcao_valores.map((valor) => {
                  const selecionado =
                    opcao.tipo === "multipla"
                      ? (selecoes[opcao.id] || []).includes(valor.id)
                      : selecoes[opcao.id] === valor.id;
                  return (
                    <label
                      key={valor.id}
                      className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors duration-150 ${
                        selecionado ? "border-brand" : "border-line"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-ink">
                        <input
                          type={opcao.tipo === "multipla" ? "checkbox" : "radio"}
                          name={opcao.id}
                          checked={selecionado}
                          onChange={() =>
                            opcao.tipo === "multipla"
                              ? alternarMultipla(opcao.id, valor.id)
                              : selecionarUnica(opcao.id, valor.id)
                          }
                          className="accent-brand"
                        />
                        {valor.nome}
                      </span>
                      {valor.ajuste_preco ? (
                        <span className="text-ink-muted">
                          {valor.ajuste_preco > 0 ? "+" : ""}
                          {formatarPreco(valor.ajuste_preco)}
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="font-semibold text-ink">{formatarPreco(precoFinal)}</span>
          <div className="flex gap-2">
            <button type="button" onClick={aoFechar} className={`${BOTAO_SECUNDARIO} text-sm`}>
              Cancelar
            </button>
            <button
              type="button"
              disabled={!podeAdicionar}
              onClick={() => aoConfirmar(opcoesSelecionadas, precoFinal)}
              className={`${BOTAO_PRIMARIO} text-sm`}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
