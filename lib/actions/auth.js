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

  const { error } = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("senha"),
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        nome: formData.get("nome"),
        tipo: formData.get("tipo"),
      },
    },
  });

  if (error) {
    return { erro: "Não foi possível criar a conta: " + error.message };
  }

  return { sucesso: true };
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
