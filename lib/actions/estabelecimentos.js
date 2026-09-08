"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";
import { registrarErro } from "@/lib/registrar-erro";

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
    registrarErro("criarEstabelecimento", error, { usuarioId: user.id });
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

  if (error) {
    // Falha aqui não trava o painel: ele cai no formulário manual. Mas sem
    // registrar, o comerciante preenchia tudo no cadastro e não entendia por
    // que a loja não apareceu sozinha.
    registrarErro("criarEstabelecimentoAutomatico", error, { usuarioId: user.id });
    return null;
  }

  return data;
}

export async function atualizarEstabelecimento(estabelecimentoId, estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase
    .from("estabelecimentos")
    .update({
      categoria_id: formData.get("categoria_id"),
      nome: formData.get("nome"),
      descricao: formData.get("descricao"),
      endereco: formData.get("endereco"),
      cidade: formData.get("cidade"),
    })
    .eq("id", estabelecimentoId);

  if (error) {
    registrarErro("atualizarEstabelecimento", error, { estabelecimentoId });
    return { erro: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/painel");
  revalidatePath("/painel/loja");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
  return { sucesso: true };
}

export async function alternarAbertoAgora(estabelecimentoId, abertoAgora) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase
    .from("estabelecimentos")
    .update({ aberto_agora: abertoAgora })
    .eq("id", estabelecimentoId);

  if (error) {
    registrarErro("alternarAbertoAgora", error, { estabelecimentoId });
    return { erro: "Não foi possível atualizar o status da loja." };
  }

  revalidatePath("/painel");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
  revalidatePath("/");
  return { sucesso: true };
}

export async function atualizarImagemEstabelecimento(estabelecimentoId, formData) {
  const supabase = await criarClienteServidor();

  const arquivo = formData.get("imagem");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { erro: "Selecione uma imagem." };
  }

  const caminho = `${estabelecimentoId}/capa.jpg`;
  const { error: erroUpload } = await supabase.storage
    .from("capas-estabelecimentos")
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type });

  if (erroUpload) {
    registrarErro("atualizarImagemEstabelecimento/upload", erroUpload, { estabelecimentoId });
    return { erro: "Não foi possível enviar a imagem." };
  }

  const { data } = supabase.storage.from("capas-estabelecimentos").getPublicUrl(caminho);
  // Cache-bust: o caminho não muda ao trocar a foto, então sem isso o
  // navegador (e o next/image) continuariam mostrando a imagem antiga.
  const urlComVersao = `${data.publicUrl}?v=${Date.now()}`;

  const { error: erroUpdate } = await supabase
    .from("estabelecimentos")
    .update({ capa_url: urlComVersao })
    .eq("id", estabelecimentoId);

  if (erroUpdate) {
    registrarErro("atualizarImagemEstabelecimento/update", erroUpdate, { estabelecimentoId });
    return { erro: "Imagem enviada, mas não foi possível salvar." };
  }

  revalidatePath("/painel");
  revalidatePath("/painel/loja");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
  revalidatePath("/");
  return { sucesso: true };
}

export async function removerImagemEstabelecimento(estabelecimentoId) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase
    .from("estabelecimentos")
    .update({ capa_url: null })
    .eq("id", estabelecimentoId);

  if (error) {
    registrarErro("removerImagemEstabelecimento", error, { estabelecimentoId });
    return { erro: "Não foi possível remover a imagem." };
  }

  revalidatePath("/painel");
  revalidatePath("/painel/loja");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
  revalidatePath("/");
  return { sucesso: true };
}
