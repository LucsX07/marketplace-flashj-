"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCarrinho } from "@/components/carrinho/CarrinhoContext";
import { criarPedido } from "@/lib/pedidos";

export default function PaginaCheckout() {
  const { itens, total, limparCarrinho } = useCarrinho();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  function finalizarPedido(evento) {
    evento.preventDefault();
    const estabelecimentoId = itens[0]?.estabelecimentoId;
    const pedido = criarPedido({
      estabelecimentoId,
      itens,
      total,
      cliente: { nome, telefone },
    });
    limparCarrinho();
    router.push(`/pedidos/${pedido.id}`);
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
        Retirada no estabelecimento. Pagamento online será integrado em breve.
      </p>

      <form onSubmit={finalizarPedido} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            required
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Telefone</label>
          <input
            required
            value={telefone}
            onChange={(evento) => setTelefone(evento.target.value)}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>

        <div className="flex items-center justify-between border-t border-black/10 pt-4">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">
            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/80"
        >
          Confirmar pedido
        </button>
      </form>
    </main>
  );
}
