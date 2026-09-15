"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { registrarErro } from "@/lib/registrar-erro";

// Nome e telefone do próprio usuário. O `tipo` (consumidor/comerciante) NÃO
// é editável aqui de propósito: virar comerciante muda o que a pessoa
// enxerga no app inteiro e envolve criar loja — isso é outro caminho.
export async function atualizarPerfil(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Você precisa estar logado." };
  }

  const nome = (formData.get("nome") || "").trim();
  if (nome.length < 2) {
    return { erro: "Escreva seu nome." };
  }

  const telefone = (formData.get("telefone") || "").trim();

  const { data: alteradas, error } = await supabase
    .from("usuarios")
    .update({ nome, telefone: telefone || null })
    .eq("id", user.id)
    .select("id");

  if (error) {
    registrarErro("atualizarPerfil", error, { usuarioId: user.id });
    return { erro: "Não foi possível salvar." };
  }

  if (!alteradas || alteradas.length === 0) {
    registrarErro(
      "atualizarPerfil",
      new Error("update não afetou nenhuma linha"),
      {
        usuarioId: user.id,
      },
    );
    return { erro: "Não foi possível salvar." };
  }

  // O nome aparece no cabeçalho e nos pedidos que o comerciante recebe.
  revalidatePath("/", "layout");
  return { sucesso: true };
}

// Exclusão da própria conta. O trabalho pesado é da função excluir_minha_conta
// no banco (ver supabase/schema.sql), que decide entre apagar de vez ou
// anonimizar dependendo de haver histórico. A action não manda id nenhum:
// a função descobre sozinha quem está chamando, senão daria pra excluir a
// conta dos outros.
export async function excluirMinhaConta() {
  const supabase = await criarClienteServidor();

  const { data: resultado, error } = await supabase.rpc("excluir_minha_conta");

  if (error) {
    registrarErro("excluirMinhaConta", error);
    return {
      erro: "Não foi possível excluir a conta agora. Tente de novo em alguns minutos.",
    };
  }

  // Sem isso o cookie de sessão continuaria no navegador apontando pra uma
  // conta que não existe mais (ou está bloqueada).
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  // Vai pra /entrar e não pra home: a home mostra o seletor de cidade pra
  // quem ainda não escolheu uma, e o aviso se perderia ali.
  redirect(`/entrar?conta=${resultado}`);
}
