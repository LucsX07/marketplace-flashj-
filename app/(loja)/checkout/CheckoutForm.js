"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { criarPedido } from "@/lib/actions/pedidos";
import { formatarPreco } from "@/lib/formatar";

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
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-black/60">Seu carrinho está vazio.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-1 text-black/60">
        Retirada no estabelecimento. Pagamento é feito na hora da retirada — o
        pagamento online chega numa próxima etapa.
      </p>

      <ul className="mt-6 divide-y divide-black/10">
        {itens.map((item) => (
          <li key={item.produto_id} className="flex justify-between py-2 text-sm">
            <span>
              {item.quantidade}x {item.nome}
            </span>
            <span>{formatarPreco(item.preco * item.quantidade)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">{formatarPreco(total)}</span>
      </div>

      {erro && <p className="mt-4 text-sm text-red-600">{erro}</p>}

      <button
        onClick={finalizarPedido}
        disabled={pendente}
        className="mt-6 w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/80 disabled:opacity-60"
      >
        {pendente ? "Confirmando..." : "Confirmar pedido"}
      </button>
    </main>
  );
}
