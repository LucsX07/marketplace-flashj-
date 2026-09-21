import { criarClienteServidor } from "@/lib/supabase/server";
import { padraoDeBusca, termoValido } from "@/lib/termo-de-busca";

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
         produto_opcao_valores ( id, nome, ajuste_preco, ordem ) )`,
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
       estabelecimentos!inner ( cidade, ativo )`,
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
         produto_opcao_valores ( id, nome, ajuste_preco, ordem ) )`,
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
    .select(
      "id, nome, descricao, preco, preco_promocional, em_destaque, imagem_url, disponivel",
    )
    .eq("estabelecimento_id", estabelecimentoId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}

// Busca da home. Antes o campo dizia "O que você está procurando?" e só
// filtrava nome de loja entre as que já estavam na tela — quem digitasse
// "caderno" não achava nada, mesmo com uma loja vendendo um. Agora procura
// no produto de verdade.
//
// Procura no nome e na descrição, porque muita gente descreve pelo uso
// ("pilha" está na descrição de coisas que não se chamam pilha). O resultado
// já vem com a loja junto: achar o produto sem saber onde comprar não serve
// pra nada.
//
// O ilike com % dos dois lados não usa índice — a varredura é a tabela
// inteira. Pro tamanho de hoje isso é instantâneo; quando o catálogo crescer,
// o caminho é a busca de texto do Postgres (pg_trgm ou tsvector), não
// remendar aqui.
const LIMITE_DA_BUSCA = 30;

export async function buscarProdutos(termo, cidade) {
  const procurado = (termo || "").trim();
  if (!termoValido(procurado)) return [];

  const supabase = await criarClienteServidor();

  const padrao = padraoDeBusca(procurado);

  let consulta = supabase
    .from("produtos")
    .select(
      `id, nome, descricao, preco, estabelecimento_id,
       preco_promocional, em_destaque, categoria_produto, imagem_url,
       produto_atributos ( id, nome, valor ),
       produto_opcoes ( id, nome, tipo, obrigatoria, ordem,
         produto_opcao_valores ( id, nome, ajuste_preco, ordem ) ),
       estabelecimentos!inner ( id, nome, cidade, ativo, aberto_agora )`,
    )
    .eq("disponivel", true)
    .eq("estabelecimentos.ativo", true)
    .or(`nome.ilike.${padrao},descricao.ilike.${padrao}`)
    .order("ordem", { referencedTable: "produto_opcoes" })
    .limit(LIMITE_DA_BUSCA);

  if (cidade) {
    consulta = consulta.ilike("estabelecimentos.cidade", cidade);
  }

  const { data, error } = await consulta;
  if (error) throw error;

  // Quem escreveu "caderno" quer o produto chamado Caderno antes do que só
  // menciona caderno na descrição. O banco não ordena por isso, então a
  // classificação é feita aqui, sobre um resultado já limitado.
  const minusculo = procurado.toLowerCase();
  return data.sort((a, b) => {
    const pesoA = a.nome.toLowerCase().includes(minusculo) ? 0 : 1;
    const pesoB = b.nome.toLowerCase().includes(minusculo) ? 0 : 1;
    if (pesoA !== pesoB) return pesoA - pesoB;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });
}
