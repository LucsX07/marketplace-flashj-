"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cadastrar } from "@/lib/actions/auth";

const estadoInicial = { erro: null, sucesso: false };

export default function PaginaCadastro() {
  const [estado, formAction, pendente] = useActionState(cadastrar, estadoInicial);

  if (estado?.sucesso) {
    return (
      <main className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-2xl font-bold">Quase lá!</h1>
        <p className="mt-4 text-black/60">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar a conta e depois volte para{" "}
          <Link href="/entrar" className="underline">
            entrar
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <p className="mt-1 text-sm text-black/60">
        Já tem conta?{" "}
        <Link href="/entrar" className="underline">
          Entrar
        </Link>
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Eu quero</label>
          <select
            name="tipo"
            defaultValue="consumidor"
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
          >
            <option value="consumidor">Comprar (consumidor)</option>
            <option value="comerciante">Vender (comerciante)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            name="nome"
            required
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            name="senha"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>

        {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

        <button
          type="submit"
          disabled={pendente}
          className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/80 disabled:opacity-60"
        >
          {pendente ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </main>
  );
}
