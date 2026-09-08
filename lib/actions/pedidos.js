"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

// O preço NÃO vem daqui. Mandamos só o que o consumidor escolheu (produto,
// quantidade, ids das opções) e a função `criar_pedido` no Postgres calcula
// o valor a partir das tabelas, grava tudo numa transação só e devolve o id.
// Assim nem o navegador nem esta action conseguem forjar um preço.
export async function criarPedido(itens, estabelecimentoId) {
  const supabase = await criarClienteServidor();

  const itensParaOBanco = itens.map((item) => ({
    produto_id: item.produto_id,
    quantidade: item.quantidade,
    valor_ids: (item.opcoes_selecionadas || []).map((opcao) => opcao.valor_id),
  }));

  const { data: pedidoId, error } = await supabase.rpc("criar_pedido", {
    p_estabelecimento_id: estabelecimentoId,
    p_itens: itensParaOBanco,
  });

  if (error) {
    // P0001 = `raise exception` nosso, com mensagem já escrita pro usuário
    // final (loja fechada, produto indisponível, opção obrigatória faltando).
    // Qualquer outro código é erro inesperado — não expõe detalhe técnico.
    return {
      erro:
        error.code === "P0001"
          ? error.message
          : "Não foi possível criar o pedido. Tente novamente.",
    };
  }

  return { pedidoId };
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
