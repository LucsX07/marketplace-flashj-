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

// Painel do comerciante: um produto com seus atributos e opções, pra tela
// de edição. Não filtra por dono aqui — quem chama confere a posse (a
// leitura de "produtos" já é pública via RLS, então isso sozinho não
// vazaria nada, mas a tela de edição precisa checar antes de mostrar).
export async function buscarProdutoDoComerciante(produtoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("produtos")
    .select(
      `id, nome, descricao, preco, disponivel, estabelecimento_id,
       preco_promocional, em_destaque, categoria_produto, imagem_url,
       produto_atributos ( id, nome, valor ),
       produto_opcoes ( id, nome, tipo, obrigatoria, ordem,
         produto_opcao_valores ( id, nome, ajuste_preco, ordem ) )`
    )
    .eq("id", produtoId)
    .order("ordem", { referencedTable: "produto_opcoes" })
    .order("ordem", { referencedTable: "produto_opcoes.produto_opcao_valores" })
    .maybeSingle();

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
