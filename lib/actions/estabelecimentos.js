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

// Tira a loja do ar (ativo = false) ou traz de volta.
//
// Diferente de "fechado agora", que é o expediente do dia: desativada, a
// loja some da vitrine, da busca e da própria página dela, e ninguém
// consegue fazer pedido — a função criar_pedido exige `ativo`. O que já
// aconteceu continua existindo: pedidos, histórico e produtos ficam
// guardados, e o comerciante segue com acesso ao painel pra reativar.
export async function alternarLojaAtiva(estabelecimentoId, ativo) {
  const supabase = await criarClienteServidor();

  // O .select() confirma que a linha era mesmo dele: se a RLS barrar, o
  // update volta sem erro e sem linha nenhuma.
  const { data: alteradas, error } = await supabase
    .from("estabelecimentos")
    .update({ ativo })
    .eq("id", estabelecimentoId)
    .select("id");

  if (error) {
    registrarErro("alternarLojaAtiva", error, { estabelecimentoId, ativo });
    return { erro: "Não foi possível alterar a situação da loja." };
  }

  if (!alteradas || alteradas.length === 0) {
    registrarErro("alternarLojaAtiva", new Error("update não afetou nenhuma linha"), {
      estabelecimentoId,
    });
    return { erro: "Loja não encontrada ou você não tem permissão para alterá-la." };
  }

  revalidatePath("/painel");
  revalidatePath("/painel/loja");
  revalidatePath(`/estabelecimentos/${estabelecimentoId}`);
  revalidatePath("/");
  return { sucesso: true };
}
