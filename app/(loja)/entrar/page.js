"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { entrar } from "@/lib/actions/auth";

const estadoInicial = { erro: null };
const campoClasse =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

function FormularioEntrar() {
  const searchParams = useSearchParams();
  const proximo = searchParams.get("proximo") || "/";
  const [estado, formAction, pendente] = useActionState(entrar, estadoInicial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="proximo" value={proximo} />
      <div>
        <label className="block text-sm font-medium text-ink">E-mail</label>
        <input type="email" name="email" required className={campoClasse} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Senha</label>
        <input type="password" name="senha" required className={campoClasse} />
      </div>

      {estado?.erro && <p className="text-sm text-warn">{estado.erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="corner-cut w-full rounded-sm bg-brand px-4 py-2 font-semibold text-on-brand hover:bg-brand-hover disabled:opacity-60"
      >
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function PaginaEntrar() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Entrar</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-brand hover:text-brand-hover">
          Cadastre-se
        </Link>
      </p>

      <Suspense fallback={null}>
        <FormularioEntrar />
      </Suspense>
    </main>
  );
}
