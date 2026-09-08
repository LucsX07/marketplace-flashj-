"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";
import { registrarErro } from "@/lib/registrar-erro";

export async function criarProduto(estabelecimentoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produtos").insert({
    estabelecimento_id: estabelecimentoId,
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    preco: Number(formData.get("preco")),
  });

  if (error) {
    registrarErro("criarProduto", error, { estabelecimentoId });
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
    registrarErro("alternarDisponibilidade", error, { produtoId });
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
    registrarErro("atualizarProduto", error, { produtoId });
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
    registrarErro("criarAtributo", error, { produtoId });
    return { erro: "Não foi possível adicionar o atributo." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function removerAtributo(produtoId, atributoId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_atributos").delete().eq("id", atributoId);

  if (error) {
    registrarErro("removerAtributo", error, { produtoId, atributoId });
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
    registrarErro("criarOpcao", error, { produtoId });
    return { erro: "Não foi possível adicionar a opção." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function removerOpcao(produtoId, opcaoId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_opcoes").delete().eq("id", opcaoId);

  if (error) {
    registrarErro("removerOpcao", error, { produtoId, opcaoId });
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
    registrarErro("criarValorOpcao", error, { produtoId, opcaoId });
    return { erro: "Não foi possível adicionar o valor." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}

export async function atualizarImagemProduto(produtoId, formData) {
  const supabase = await criarClienteServidor();

  const arquivo = formData.get("imagem");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { erro: "Selecione uma imagem." };
  }

  const caminho = `${produtoId}/imagem.jpg`;
  const { error: erroUpload } = await supabase.storage
    .from("imagens-produtos")
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type });

  if (erroUpload) {
    registrarErro("atualizarImagemProduto/upload", erroUpload, { produtoId });
    return { erro: "Não foi possível enviar a imagem." };
  }

  const { data } = supabase.storage.from("imagens-produtos").getPublicUrl(caminho);
  const urlComVersao = `${data.publicUrl}?v=${Date.now()}`;

  const { error: erroUpdate } = await supabase
    .from("produtos")
    .update({ imagem_url: urlComVersao })
    .eq("id", produtoId);

  if (erroUpdate) {
    registrarErro("atualizarImagemProduto/update", erroUpdate, { produtoId });
    return { erro: "Imagem enviada, mas não foi possível salvar." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  revalidatePath("/painel/produtos");
  return { sucesso: true };
}

export async function removerImagemProduto(produtoId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase
    .from("produtos")
    .update({ imagem_url: null })
    .eq("id", produtoId);

  if (error) {
    registrarErro("removerImagemProduto", error, { produtoId });
    return { erro: "Não foi possível remover a imagem." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  revalidatePath("/painel/produtos");
  return { sucesso: true };
}

export async function removerValorOpcao(produtoId, valorId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.from("produto_opcao_valores").delete().eq("id", valorId);

  if (error) {
    registrarErro("removerValorOpcao", error, { produtoId, valorId });
    return { erro: "Não foi possível remover o valor." };
  }

  revalidatePath(`/painel/produtos/${produtoId}`);
  return { sucesso: true };
}
