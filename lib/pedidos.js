import { criarClienteServidor } from "@/lib/supabase/server";

export { STATUS_PEDIDO, STATUS_LABEL } from "@/lib/status-pedido";

export async function buscarPedidoPorId(id) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      `id, status, total, criado_em,
       estabelecimentos(nome, capa_url),
       itens_pedido(quantidade, preco_unitario, subtotal, produtos(nome),
         item_pedido_opcoes(nome_opcao, nome_valor, ajuste_preco)),
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

// Painel: resumo do dia (pedidos e receita) — filtro simples por data,
// sem tabela nem coluna nova. Pedidos recusados não entram na receita.
export async function resumoDoDia(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const inicioDoDia = new Date();
  inicioDoDia.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("pedidos")
    .select("total, status")
    .eq("estabelecimento_id", estabelecimentoId)
    .gte("criado_em", inicioDoDia.toISOString());

  if (error) throw error;

  const pedidosHoje = data.length;
  const receitaHoje = data
    .filter((pedido) => pedido.status !== "recusado")
    .reduce((soma, pedido) => soma + Number(pedido.total), 0);

  return { pedidosHoje, receitaHoje };
}

// Painel do comerciante: pedidos recebidos por um estabelecimento, com
// dados do consumidor pra contato.
export async function listarPedidosDoEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      `id, status, total, criado_em, usuarios(nome, telefone),
       itens_pedido(quantidade, produtos(nome),
         item_pedido_opcoes(nome_opcao, nome_valor, ajuste_preco))`
    )
    .eq("estabelecimento_id", estabelecimentoId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}
