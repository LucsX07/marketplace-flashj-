import { criarClienteServidor } from "@/lib/supabase/server";

export async function listarCategorias() {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome");

  if (error) throw error;
  return data;
}

// Visão do administrador: inclui as desativadas (que `listarCategorias` esconde)
// e diz quantas lojas usam cada uma — sem isso, desativar ou excluir vira um
// tiro no escuro.
//
// A contagem é feita aqui e não no banco porque PostgREST não agrupa, e o
// número de lojas é pequeno o bastante pra isso não pesar. Se um dia a
// plataforma tiver muitas lojas, isso vira uma função no Postgres.
export async function listarCategoriasParaAdmin() {
  const supabase = await criarClienteServidor();

  const [{ data: categorias, error }, { data: lojas, error: erroLojas }] =
    await Promise.all([
      supabase.from("categorias").select("id, nome, ativo").order("nome"),
      supabase.from("estabelecimentos").select("categoria_id"),
    ]);

  if (error) throw error;
  if (erroLojas) throw erroLojas;

  const lojasPorCategoria = new Map();
  for (const loja of lojas) {
    lojasPorCategoria.set(
      loja.categoria_id,
      (lojasPorCategoria.get(loja.categoria_id) || 0) + 1,
    );
  }

  return categorias.map((categoria) => ({
    ...categoria,
    lojas: lojasPorCategoria.get(categoria.id) || 0,
  }));
}

// O app inteiro já trata comerciante e administrador quase igual (ver proxy.js
// e a tela de perfil). Isto aqui é só pra decidir quem enxerga a área de
// administração — a proteção de verdade está no proxy e nas policies do banco.
export async function souAdministrador() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("id", user.id)
    .maybeSingle();

  return data?.tipo === "administrador";
}
