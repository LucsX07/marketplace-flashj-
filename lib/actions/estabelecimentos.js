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
    cidade: formData.get("cidade"),
  });

  if (error) {
    return { erro: "Não foi possível cadastrar o estabelecimento." };
  }

  revalidatePath("/painel");
  return { sucesso: true };
}

// Chamada ao carregar o painel: se o comerciante preencheu os dados do
// negócio já no cadastro (ver FormularioCadastro), cria o estabelecimento
// direto a partir desses metadados, sem pedir de novo.
export async function criarEstabelecimentoAutomatico() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metadados = user?.user_metadata;
  if (!user || !metadados?.nome_estabelecimento || !metadados?.categoria_id) {
    return null;
  }

  const { data, error } = await supabase
    .from("estabelecimentos")
    .insert({
      dono_id: user.id,
      categoria_id: metadados.categoria_id,
      nome: metadados.nome_estabelecimento,
      cidade: metadados.cidade_estabelecimento || null,
    })
    .select("id, nome, descricao, endereco, cidade, categoria_id")
    .single();

  if (error) return null;

  return data;
}
