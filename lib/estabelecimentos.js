import { criarClienteServidor } from "@/lib/supabase/server";

export async function listarEstabelecimentos() {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("estabelecimentos")
    .select("id, nome, descricao, endereco, categorias(nome)")
    .eq("ativo", true)
    .order("nome");

  if (error) throw error;
  return data;
}

export async function buscarEstabelecimentoPorId(id) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("estabelecimentos")
    .select("id, nome, descricao, endereco, categorias(nome)")
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
    .select("id, nome, descricao, endereco, categoria_id")
    .eq("dono_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
