"use client";

import { use, useEffect, useState } from "react";
import { buscarPedidoPorId, STATUS_LABEL } from "@/lib/pedidos";

export default function PaginaPedido({ params }) {
  const { id } = use(params);
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setPedido(buscarPedidoPorId(id));
    setCarregando(false);
  }, [id]);

  if (carregando) {
    return null;
  }

  if (!pedido) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pedido #{pedido.id.slice(0, 8)}</h1>
      <p className="mt-2 text-lg">
        Status: <span className="font-semibold">{STATUS_LABEL[pedido.status]}</span>
      </p>

      <ul className="mt-6 divide-y divide-black/10">
        {pedido.itens.map((item) => (
          <li key={item.produtoId} className="flex justify-between py-2">
            <span>
              {item.quantidade}x {item.nome}
            </span>
            <span>
              {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-semibold">
        <span>Total</span>
        <span>
          {pedido.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </div>
    </main>
  );
}
