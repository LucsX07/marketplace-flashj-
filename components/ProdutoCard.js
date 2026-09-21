"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, CARTAO } from "@/lib/ui";
import { ITEM_ENTRADA, TOQUE_BOTAO } from "@/lib/motion";
import SeletorDeOpcoesProduto from "@/components/SeletorDeOpcoesProduto";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";

// Visto desenhado em vez do caractere ✓. Glifo unicode no lugar de ícone
// herda a fonte do sistema: muda de forma e de peso conforme o aparelho, e
// nunca alinha com o resto. Este acompanha o traço do texto ao lado.
function IconeVisto() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// mostrarLoja: usado no resultado de busca, onde os produtos vêm de lojas
// diferentes. Achar "caderno" sem saber em qual loja comprar não serve de
// nada. Na vitrine de uma loja só, o nome seria repetição.
// lojaFechada: com a loja fechada, o pedido é recusado pelo banco (a função
// criar_pedido exige `aberto_agora`). Deixar o botão ativo levaria a pessoa a
// montar o carrinho inteiro pra descobrir isso só no checkout.
// ocultarDestaque: dentro da seção "Em destaque" o selo repete o título da
// seção e, num card estreito de celular, ele ainda espremia o nome do produto
// até sobrar "Caderno 10…". Fora dali (na página da loja) o selo informa.
export default function ProdutoCard({
  produto,
  mostrarLoja = false,
  lojaFechada = false,
  ocultarDestaque = false,
}) {
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
    <motion.div variants={ITEM_ENTRADA} className={`${CARTAO} overflow-hidden`}>
      <ImagemComPlaceholder
        src={produto.imagem_url}
        alt={produto.nome}
        nome={produto.nome}
        className="aspect-[4/3] w-full"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display line-clamp-2 font-bold text-ink">
            {produto.nome}
          </h3>
          {produto.em_destaque && !ocultarDestaque && (
            <span className="shrink-0 rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
              Destaque
            </span>
          )}
        </div>
        {mostrarLoja && produto.estabelecimentos?.nome && (
          <Link
            href={`/estabelecimentos/${produto.estabelecimento_id}`}
            className="mt-0.5 flex items-center gap-1 text-xs font-medium text-brand transition-colors duration-150 hover:text-brand-hover"
          >
            {produto.estabelecimentos.nome}
            {produto.estabelecimentos.aberto_agora === false && (
              <span className="font-normal text-ink-faint">
                · fechada agora
              </span>
            )}
          </Link>
        )}

        {produto.descricao && (
          <p className="line-clamp-2 text-sm text-ink-muted">
            {produto.descricao}
          </p>
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

        <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="numerico font-display text-lg font-bold tracking-tight text-ink">
            {temOpcoes && (
              <span className="mr-1 font-sans text-xs font-normal text-ink-faint">
                a partir de
              </span>
            )}
            {produto.preco_promocional ? (
              <>
                <span className="numerico mr-1.5 font-sans text-xs font-normal text-ink-faint line-through">
                  {formatarPreco(produto.preco)}
                </span>
                {formatarPreco(produto.preco_promocional)}
              </>
            ) : (
              formatarPreco(produto.preco)
            )}
          </span>
          {lojaFechada ? (
            <span className="rounded-md bg-surface-2 px-3 py-1.5 text-center text-sm font-medium text-ink-muted">
              Loja fechada
            </span>
          ) : (
            <motion.button
              whileTap={TOQUE_BOTAO}
              onClick={lidarComClique}
              className={`${BOTAO_PRIMARIO} w-full justify-center py-1.5 text-sm sm:w-auto`}
            >
              {adicionado
                ? "Adicionado ✓"
                : temOpcoes
                  ? "Escolher"
                  : "Adicionar"}
            </motion.button>
          )}
        </div>
      </div>

      {seletorAberto && (
        <SeletorDeOpcoesProduto
          produto={produto}
          aoFechar={() => setSeletorAberto(false)}
          aoConfirmar={confirmarAdicao}
        />
      )}
    </motion.div>
  );
}
