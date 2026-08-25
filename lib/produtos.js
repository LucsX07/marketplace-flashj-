import { criarClienteServidor } from "@/lib/supabase/server";

// Vitrine pública: só produtos disponíveis.
export async function buscarProdutosPorEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, estabelecimento_id")
    .eq("estabelecimento_id", estabelecimentoId)
    .eq("disponivel", true)
    .order("nome");

  if (error) throw error;
  return data;
}

// Painel do comerciante: todos os produtos, disponíveis ou não.
export async function listarTodosProdutosDoEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, disponivel")
    .eq("estabelecimento_id", estabelecimentoId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}
