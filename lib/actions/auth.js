"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";
import { registrarErro } from "@/lib/registrar-erro";
import { mensagemDeAuth } from "@/lib/mensagens-auth";

export async function entrar(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("senha"),
  });

  if (error) {
    // Sem e-mail no log: senha errada é rotina, e log não é lugar de dado
    // pessoal. Se começar a aparecer muito, o problema é outro.
    registrarErro("entrar", error);
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

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("senha"),
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: dados,
    },
  });

  if (error) {
    registrarErro("cadastrar", error, { tipo: dados.tipo });
    return {
      erro: mensagemDeAuth(
        error,
        "Não foi possível criar a conta agora. Tente de novo em alguns minutos.",
      ),
    };
  }

  // Com a confirmação de e-mail LIGADA no Supabase (o padrão), não vem sessão
  // nenhuma aqui: a pessoa precisa clicar no link antes de entrar. Com ela
  // DESLIGADA, o signUp já devolve a sessão e a pessoa está logada agora.
  //
  // As duas configurações são legítimas — desligar é o que faz sentido pra
  // uma demonstração ao vivo, onde ninguém vai parar pra abrir a caixa de
  // entrada. Por isso a decisão é tomada olhando o que voltou, e não chutada:
  // mandar alguém já logado "conferir o e-mail" seria mentira.
  if (data?.session) {
    revalidatePath("/", "layout");
    redirect(dados.tipo === "comerciante" ? "/painel" : "/");
  }

  return { sucesso: true };
}

// Manda o e-mail com o link de redefinição. O link volta pelo /auth/callback,
// que troca o código por uma sessão temporária e joga o usuário em
// /redefinir-senha — é lá que a senha nova é gravada.
export async function pedirRedefinicaoDeSenha(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email"),
    {
      redirectTo: `${origin}/auth/callback?proximo=/redefinir-senha`,
    },
  );

  if (error) {
    registrarErro("pedirRedefinicaoDeSenha", error);
    return {
      erro: mensagemDeAuth(
        error,
        "Não foi possível enviar o e-mail agora. Tente de novo em alguns minutos.",
      ),
    };
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
    registrarErro("redefinirSenha", error, { usuarioId: user.id });
    return {
      erro: mensagemDeAuth(
        error,
        "Não foi possível trocar a senha agora. Tente de novo em alguns minutos.",
      ),
    };
  }

  revalidatePath("/", "layout");
  redirect("/perfil?senha_alterada=1");
}

// Login com Google. O Supabase devolve a URL de consentimento do Google e o
// navegador vai pra lá; quem termina o trabalho é /auth/callback, que já
// existia pra confirmação de e-mail e redefinição de senha — o código que
// volta é trocado por sessão do mesmo jeito.
//
// Só serve pra comprar. Cadastro de comerciante pede telefone, nome da loja,
// cidade e categoria, que a conta Google não tem; empurrar isso pra um
// formulário depois do login seria pior que o formulário direto.
export async function entrarComGoogle(estadoAnterior, formData) {
  const supabase = await criarClienteServidor();
  const origin = (await headers()).get("origin");
  const proximo = formData.get("proximo") || "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?proximo=${encodeURIComponent(proximo)}`,
    },
  });

  if (error || !data?.url) {
    registrarErro(
      "entrarComGoogle",
      error ?? new Error("Supabase não devolveu a URL do Google"),
    );
    return {
      erro: "Não foi possível entrar com o Google agora. Tente pelo e-mail.",
    };
  }

  // redirect() lança por dentro, então nada depois daqui roda.
  redirect(data.url);
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
