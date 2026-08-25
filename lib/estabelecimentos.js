import { criarClienteServidor } from "@/lib/supabase/server";

// Sem cidade: lista tudo (evita mostrar uma vitrine vazia enquanto os
// estabelecimentos ainda não tiverem a cidade preenchida).
export async function listarEstabelecimentos(cidade) {
  const supabase = await criarClienteServidor();
  let consulta = supabase
    .from("estabelecimentos")
    .select("id, nome, descricao, endereco, cidade, categorias(nome)")
    .eq("ativo", true)
    .order("nome");

  if (cidade) {
    consulta = consulta.ilike("cidade", cidade);
  }

  const { data, error } = await consulta;
  if (error) throw error;

  // Se a cidade escolhida não bate com nenhum estabelecimento (ainda não
  // há cobertura ali), cai de volta pra lista completa em vez de vazia.
  if (cidade && data.length === 0) {
    return listarEstabelecimentos();
  }

  return data;
}

export async function buscarEstabelecimentoPorId(id) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("estabelecimentos")
    .select("id, nome, descricao, endereco, cidade, categorias(nome)")
    .eq("id", id)
    .eq("ativo", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// O estabelecimento do comerciante logado. Usada no painel — até termos
// suporte a múltiplas lojas por comerciante, pegamos a primeira.
export async function buscarMeuEstabelecimento() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("estabelecimentos")
    .select("id, nome, descricao, endereco, cidade, categoria_id, categorias(nome)")
    .eq("dono_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
