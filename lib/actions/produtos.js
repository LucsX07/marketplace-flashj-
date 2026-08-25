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

// Campos base estendidos (preço promocional, destaque, categoria livre) —
// ficam de fora do formulário rápido de cadastro e são editados aqui.
export async function atualizarProduto(produtoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const precoPromocional = formData.get("preco_promocional");

  const { error } = await supabase
    .from("produtos")
    .update({
      nome: formData.get("nome"),
      descricao: formData.get("descricao"),
      preco: Number(formData.get("preco")),
      preco_promocional: precoPromocional ? Number(precoPromocional) : null,
      em_destaque: formData.get("em_destaque") === "on",
      categoria_produto: formData.get("categoria_produto") || null,
    })
    .eq("id", produtoId);

  if (error) {
    return { erro: "Não foi possível salvar as alterações." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  revalidatePath("/painel/produtos");
  return { sucesso: true };
}

export async function criarAtributo(produtoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_atributos").insert({
    produto_id: produtoId,
    nome: formData.get("nome"),
    valor: formData.get("valor"),
  });

  if (error) {
    return { erro: "Não foi possível adicionar o atributo." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function removerAtributo(produtoId, atributoId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_atributos").delete().eq("id", atributoId);

  if (error) {
    return { erro: "Não foi possível remover o atributo." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function criarOpcao(produtoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_opcoes").insert({
    produto_id: produtoId,
    nome: formData.get("nome"),
    tipo: formData.get("tipo") === "multipla" ? "multipla" : "unica",
    obrigatoria: formData.get("obrigatoria") === "on",
  });

  if (error) {
    return { erro: "Não foi possível adicionar a opção." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function removerOpcao(produtoId, opcaoId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_opcoes").delete().eq("id", opcaoId);

  if (error) {
    return { erro: "Não foi possível remover a opção." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function criarValorOpcao(produtoId, opcaoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const ajustePreco = formData.get("ajuste_preco");

  const { error } = await supabase.from("produto_opcao_valores").insert({
    opcao_id: opcaoId,
    nome: formData.get("nome"),
    ajuste_preco: ajustePreco ? Number(ajustePreco) : 0,
  });

  if (error) {
    return { erro: "Não foi possível adicionar o valor." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function removerValorOpcao(produtoId, valorId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_opcao_valores").delete().eq("id", valorId);

  if (error) {
    return { erro: "Não foi possível remover o valor." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}
