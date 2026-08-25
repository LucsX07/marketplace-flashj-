"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function criarPedido(itens, estabelecimentoId, total) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Você precisa entrar na sua conta para finalizar o pedido." };
  }

  const { data: pedido, error: erroPedido } = await supabase
    .from("pedidos")
    .insert({ consumidor_id: user.id, estabelecimento_id: estabelecimentoId, total })
    .select("id")
    .single();

  if (erroPedido) {
    return { erro: "Não foi possível criar o pedido. Tente novamente." };
  }

  const linhasItens = itens.map((item) => ({
    pedido_id: pedido.id,
    produto_id: item.produto_id,
    quantidade: item.quantidade,
    preco_unitario: item.preco,
    subtotal: item.preco * item.quantidade,
  }));

  const { error: erroItens } = await supabase.from("itens_pedido").insert(linhasItens);
  if (erroItens) {
    return { erro: "Não foi possível registrar os itens do pedido." };
  }

  const { error: erroPagamento } = await supabase.from("pagamentos").insert({
    pedido_id: pedido.id,
    metodo: "retirada",
    status: "pendente",
    valor: total,
  });
  if (erroPagamento) {
    return { erro: "Não foi possível registrar o pagamento." };
  }

  return { pedidoId: pedido.id };
}

export async function atualizarStatusPedido(pedidoId, novoStatus) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase
    .from("pedidos")
    .update({ status: novoStatus, atualizado_em: new Date().toISOString() })
    .eq("id", pedidoId);

  if (error) {
    return { erro: "Não foi possível atualizar o status do pedido." };
  }

  revalidatePath("/painel/pedidos");
  return { sucesso: true };
}
