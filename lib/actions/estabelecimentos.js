"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function criarEstabelecimento(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Você precisa estar logado." };
  }

  const { error } = await supabase.from("estabelecimentos").insert({
    dono_id: user.id,
    categoria_id: formData.get("categoria_id"),
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    endereco: formData.get("endereco"),
  });

  if (error) {
    return { erro: "Não foi possível cadastrar o estabelecimento." };
  }

  revalidatePath("/painel");
  return { sucesso: true };
}
