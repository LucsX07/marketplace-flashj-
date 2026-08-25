"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NOME_COOKIE = "cidade";

async function resolverCidade(valor) {
  const somenteDigitos = valor.replace(/\D/g, "");

  if (somenteDigitos.length === 8) {
    const resposta = await fetch(`https://viacep.com.br/ws/${somenteDigitos}/json/`);
    const dados = await resposta.json();
    if (!dados.erro && dados.localidade) {
      return dados.localidade;
    }
    return null;
  }

  return valor.trim() || null;
}

export async function definirCidade(estadoAnterior, formData) {
  const valor = formData.get("cidade")?.toString() ?? "";
  const cidade = await resolverCidade(valor);

  if (!cidade) {
    return { erro: "Não encontramos essa cidade. Confira o CEP ou digite o nome da cidade." };
  }

  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE, cidade, {
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  redirect("/");
}

export async function limparCidade() {
  const cookieStore = await cookies();
  cookieStore.delete(NOME_COOKIE);
  redirect("/");
}
