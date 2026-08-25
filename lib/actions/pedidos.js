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

  const { data: itensPedido, error: erroItens } = await supabase
    .from("itens_pedido")
    .insert(linhasItens)
    .select("id");
  if (erroItens) {
    return { erro: "Não foi possível registrar os itens do pedido." };
  }

  // Congela as opções escolhidas (nome + ajuste de preço), mesmo raciocínio
  // do preco_unitario: se o comerciante mudar a opção depois, o pedido já
  // feito não pode mudar de descrição.
  const linhasOpcoes = itens.flatMap((item, indice) =>
    (item.opcoes_selecionadas || []).map((opcao) => ({
      item_pedido_id: itensPedido[indice].id,
      nome_opcao: opcao.opcao_nome,
      nome_valor: opcao.valor_nome,
      ajuste_preco: opcao.ajuste_preco,
    }))
  );

  if (linhasOpcoes.length > 0) {
    const { error: erroOpcoes } = await supabase.from("item_pedido_opcoes").insert(linhasOpcoes);
    if (erroOpcoes) {
      return { erro: "Não foi possível registrar as opções do pedido." };
    }
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
