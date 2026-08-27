"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { criarPedido } from "@/lib/actions/pedidos";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, CARTAO } from "@/lib/ui";

function Etapa({ numero, titulo, children }) {
  return (
    <section className={`${CARTAO} animate-entrada mt-4 p-4`}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
          {numero}
        </span>
        <h2 className="font-display font-bold text-ink">{titulo}</h2>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function CheckoutForm() {
  const { itens, total, limparCarrinho } = useCarrinho();
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();
  const [erro, setErro] = useState(null);

  function finalizarPedido() {
    setErro(null);
    const estabelecimentoId = itens[0]?.estabelecimento_id;

    iniciarTransicao(async () => {
      const resultado = await criarPedido(itens, estabelecimentoId, total);

      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }

      limparCarrinho();
      router.push(`/pedidos/${resultado.pedidoId}?novo=1`);
    });
  }

  if (itens.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Checkout
        </h1>
        <p className="mt-4 text-ink-muted">Seu carrinho está vazio.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="animate-entrada font-display text-2xl font-extrabold tracking-tight text-ink">
        Checkout
      </h1>

      <Etapa numero="1" titulo="Pedido">
        <ul className="divide-y divide-line">
          {itens.map((item) => (
            <li key={item.chave} className="flex justify-between py-2 text-sm text-ink">
              <span>
                {item.quantidade}x {item.nome}
                {item.opcoes_selecionadas?.length > 0 && (
                  <span className="block text-xs text-ink-faint">
                    {item.opcoes_selecionadas.map((opcao) => opcao.valor_nome).join(", ")}
                  </span>
                )}
              </span>
              <span>{formatarPreco(item.preco * item.quantidade)}</span>
            </li>
          ))}
        </ul>
      </Etapa>

      <Etapa numero="2" titulo="Retirada e pagamento">
        <p className="text-sm text-ink-muted">
          Você retira o pedido no estabelecimento e paga na hora — o pagamento
          online chega numa próxima etapa.
        </p>
      </Etapa>

      <Etapa numero="3" titulo="Confirmar">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-ink">Total</span>
          <span className="font-display text-lg font-bold text-ink">
            {formatarPreco(total)}
          </span>
        </div>

        {erro && <p className="animate-entrada mt-3 text-sm text-warn">{erro}</p>}

        <button
          onClick={finalizarPedido}
          disabled={pendente}
          className={`${BOTAO_PRIMARIO} mt-4 w-full`}
        >
          {pendente ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </Etapa>
    </main>
  );
}
