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
