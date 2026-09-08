"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function entrar(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("senha"),
  });

  if (error) {
    return { erro: "E-mail ou senha inválidos." };
  }

  revalidatePath("/", "layout");
  redirect(formData.get("proximo") || "/");
}

export async function cadastrar(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();
  const origin = (await headers()).get("origin");

  const dados = {
    nome: formData.get("nome"),
    tipo: formData.get("tipo"),
  };

  if (formData.get("tipo") === "comerciante") {
    dados.telefone = formData.get("telefone");
    dados.nome_estabelecimento = formData.get("nome_estabelecimento");
    dados.cidade_estabelecimento = formData.get("cidade_estabelecimento");
    dados.categoria_id = formData.get("categoria_id");
  }

  const { error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("senha"),
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: dados,
    },
  });

  if (error) {
    return { erro: "Não foi possível criar a conta: " + error.message };
  }

  return { sucesso: true };
}

// Manda o e-mail com o link de redefinição. O link volta pelo /auth/callback,
// que troca o código por uma sessão temporária e joga o usuário em
// /redefinir-senha — é lá que a senha nova é gravada.
export async function pedirRedefinicaoDeSenha(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(formData.get("email"), {
    redirectTo: `${origin}/auth/callback?proximo=/redefinir-senha`,
  });

  if (error) {
    return { erro: "Não foi possível enviar o e-mail agora. Tente de novo em alguns minutos." };
  }

  // Resposta igual existindo ou não a conta: se dissesse "e-mail não
  // cadastrado", qualquer um poderia descobrir quem tem conta aqui.
  return { sucesso: true };
}

// Grava a senha nova. Só funciona com a sessão que veio do link do e-mail
// (ou com o usuário já logado) — sem isso o updateUser falha.
export async function redefinirSenha(estadoAnterior, formData) {
  const senha = formData.get("senha");

  if (senha !== formData.get("confirmacao")) {
    return { erro: "As duas senhas não são iguais." };
  }

  if (!senha || senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Seu link expirou. Peça um novo e-mail de redefinição." };
  }

  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    return { erro: "Não foi possível trocar a senha: " + error.message };
  }

  revalidatePath("/", "layout");
  redirect("/perfil?senha_alterada=1");
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
