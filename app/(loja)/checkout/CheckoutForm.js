"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { criarPedido } from "@/lib/actions/pedidos";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO } from "@/lib/ui";

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
      router.push(`/pedidos/${resultado.pedidoId}`);
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
    <main className="animate-entrada mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Checkout</h1>
      <p className="mt-1 text-ink-muted">
        Retirada no estabelecimento. Pagamento é feito na hora da retirada — o
        pagamento online chega numa próxima etapa.
      </p>

      <ul className="mt-6 divide-y divide-line">
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

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="font-semibold text-ink">{formatarPreco(total)}</span>
      </div>

      {erro && <p className="mt-4 text-sm text-warn">{erro}</p>}

      <button onClick={finalizarPedido} disabled={pendente} className={`${BOTAO_PRIMARIO} mt-6 w-full`}>
        {pendente ? "Confirmando..." : "Confirmar pedido"}
      </button>
    </main>
  );
}
