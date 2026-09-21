import { criarClienteServidor } from "@/lib/supabase/server";
import { registrarErro } from "@/lib/registrar-erro";

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
       pagamentos(metodo, status)`,
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
    .select(
      "id, status, total, criado_em, estabelecimentos(nome), itens_pedido(quantidade)",
    )
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
//
// O nome e o telefone NÃO saem de um join com `usuarios`. A policy dessa
// tabela é "cada um vê só o próprio perfil", então o join voltava vazio e o
// comerciante via pedido sem saber de quem era. Alargar a policy pra ele ver
// perfis resolveria — e abriria a tabela de gente inteira pra quem tem loja.
//
// A saída é a função `contatos_pedidos_da_loja`: ela devolve nome e telefone
// só dos pedidos da loja de quem está chamando, confere o dono pelo
// auth.uid() lá dentro e não aceita id de usuário nenhum por parâmetro.
export async function listarPedidosDoEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();

  const [{ data, error }, { data: contatos, error: erroContatos }] =
    await Promise.all([
      supabase
        .from("pedidos")
        .select(
          `id, status, total, criado_em,
         itens_pedido(quantidade, produtos(nome),
           item_pedido_opcoes(nome_opcao, nome_valor, ajuste_preco))`,
        )
        .eq("estabelecimento_id", estabelecimentoId)
        .order("criado_em", { ascending: false }),
      supabase.rpc("contatos_pedidos_da_loja", {
        p_estabelecimento_id: estabelecimentoId,
      }),
    ]);

  if (error) throw error;

  // Falha só nos contatos não derruba a tela: é melhor o comerciante ver os
  // pedidos sem o nome do cliente do que não ver pedido nenhum.
  if (erroContatos) {
    registrarErro("listarPedidosDoEstabelecimento/contatos", erroContatos, {
      estabelecimentoId,
    });
  }

  const contatoPorPedido = new Map(
    (contatos || []).map((contato) => [contato.pedido_id, contato]),
  );

  return data.map((pedido) => ({
    ...pedido,
    // Mantém o formato que o componente já espera (pedido.usuarios?.nome).
    usuarios: contatoPorPedido.get(pedido.id) ?? null,
  }));
}
