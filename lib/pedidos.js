import { criarClienteServidor } from "@/lib/supabase/server";

export { STATUS_PEDIDO, STATUS_LABEL } from "@/lib/status-pedido";

export async function buscarPedidoPorId(id) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      `id, status, total, criado_em,
       estabelecimentos(nome),
       itens_pedido(quantidade, preco_unitario, subtotal, produtos(nome)),
       pagamentos(metodo, status)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// "Meus pedidos": histórico de compras do consumidor logado, do mais
// recente pro mais antigo.
export async function listarMeusPedidos() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("pedidos")
    .select("id, status, total, criado_em, estabelecimentos(nome), itens_pedido(quantidade)")
    .eq("consumidor_id", user.id)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}

// Painel do comerciante: pedidos recebidos por um estabelecimento, com
// dados do consumidor pra contato.
export async function listarPedidosDoEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "id, status, total, criado_em, usuarios(nome, telefone), itens_pedido(quantidade, produtos(nome))"
    )
    .eq("estabelecimento_id", estabelecimentoId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}
