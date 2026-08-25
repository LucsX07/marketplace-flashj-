"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { entrar } from "@/lib/actions/auth";
import { BOTAO_PRIMARIO, CAMPO, LINK_MARCA } from "@/lib/ui";

const estadoInicial = { erro: null };

function FormularioEntrar() {
  const searchParams = useSearchParams();
  const proximo = searchParams.get("proximo") || "/";
  const [estado, formAction, pendente] = useActionState(entrar, estadoInicial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="proximo" value={proximo} />
      <div>
        <label className="block text-sm font-medium text-ink">E-mail</label>
        <input type="email" name="email" required className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Senha</label>
        <input type="password" name="senha" required className={CAMPO} />
      </div>

      {estado?.erro && <p className="animate-entrada text-sm text-warn">{estado.erro}</p>}

      <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} w-full`}>
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function PaginaEntrar() {
  return (
    <main className="animate-entrada mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Entrar</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className={LINK_MARCA}>
          Cadastre-se
        </Link>
      </p>

      <Suspense fallback={null}>
        <FormularioEntrar />
      </Suspense>
    </main>
  );
}
