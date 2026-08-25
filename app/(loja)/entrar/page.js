"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { entrar } from "@/lib/actions/auth";

const estadoInicial = { erro: null };

function FormularioEntrar() {
  const searchParams = useSearchParams();
  const proximo = searchParams.get("proximo") || "/";
  const [estado, formAction, pendente] = useActionState(entrar, estadoInicial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="proximo" value={proximo} />
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
          className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
        />
      </div>

      {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/80 disabled:opacity-60"
      >
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function PaginaEntrar() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Entrar</h1>
      <p className="mt-1 text-sm text-black/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="underline">
          Cadastre-se
        </Link>
      </p>

      <Suspense fallback={null}>
        <FormularioEntrar />
      </Suspense>
    </main>
  );
}
