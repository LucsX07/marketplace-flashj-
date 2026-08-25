import { criarClienteServidor } from "@/lib/supabase/server";

// Vitrine pública: só produtos disponíveis, já com atributos e opções pro
// consumidor ver antes de comprar.
export async function buscarProdutosPorEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("produtos")
    .select(
      `id, nome, descricao, preco, estabelecimento_id,
       preco_promocional, em_destaque, categoria_produto, imagem_url,
       produto_atributos ( id, nome, valor ),
       produto_opcoes ( id, nome, tipo, obrigatoria, ordem,
         produto_opcao_valores ( id, nome, ajuste_preco, ordem ) )`
    )
    .eq("estabelecimento_id", estabelecimentoId)
    .eq("disponivel", true)
    .order("nome")
    .order("ordem", { referencedTable: "produto_opcoes" });

  if (error) throw error;
  return data;
}

// Home da cidade: produtos marcados em destaque por qualquer estabelecimento
// ativo daquela cidade — só aparece se houver dado real, sem inventar nada.
export async function listarProdutosEmDestaque(cidade) {
  const supabase = await criarClienteServidor();
  let consulta = supabase
    .from("produtos")
    .select(
      `id, nome, descricao, preco, estabelecimento_id,
       preco_promocional, em_destaque, categoria_produto, imagem_url,
       produto_atributos ( id, nome, valor ),
       produto_opcoes ( id, nome, tipo, obrigatoria, ordem,
         produto_opcao_valores ( id, nome, ajuste_preco, ordem ) ),
       estabelecimentos!inner ( cidade, ativo )`
    )
    .eq("em_destaque", true)
    .eq("disponivel", true)
    .eq("estabelecimentos.ativo", true)
    .order("ordem", { referencedTable: "produto_opcoes" })
    .limit(8);

  if (cidade) {
    consulta = consulta.ilike("estabelecimentos.cidade", cidade);
  }

  const { data, error } = await consulta;
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
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Painel do comerciante: todos os produtos, disponíveis ou não.
export async function listarTodosProdutosDoEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, descricao, preco, preco_promocional, em_destaque, imagem_url, disponivel")
    .eq("estabelecimento_id", estabelecimentoId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}
