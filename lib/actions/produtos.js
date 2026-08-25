"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function criarProduto(estabelecimentoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produtos").insert({
    estabelecimento_id: estabelecimentoId,
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    preco: Number(formData.get("preco")),
  });

  if (error) {
    return { erro: "Não foi possível cadastrar o produto." };
  }

  revalidatePath("/painel/produtos");
  return { sucesso: true };
}

export async function alternarDisponibilidade(produtoId, disponivel) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase
    .from("produtos")
    .update({ disponivel })
    .eq("id", produtoId);

  if (error) {
    return { erro: "Não foi possível atualizar o produto." };
  }

  revalidatePath("/painel/produtos");
  return { sucesso: true };
}
