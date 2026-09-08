"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { pedirRedefinicaoDeSenha } from "@/lib/actions/auth";
import { BOTAO_PRIMARIO, CAMPO, LINK_MARCA } from "@/lib/ui";

const estadoInicial = { erro: null, sucesso: false };

function FormularioEsqueciSenha() {
  const expirado = useSearchParams().get("expirado");
  const [estado, formAction, pendente] = useActionState(pedirRedefinicaoDeSenha, estadoInicial);

  if (estado?.sucesso) {
    return (
      <div className="animate-entrada mt-6 rounded-md border border-brand bg-brand-tint p-4">
        <p className="font-medium text-brand">E-mail enviado.</p>
        <p className="mt-1 text-sm text-ink-muted">
          Se existe uma conta com esse e-mail, o link de redefinição chegou na caixa de
          entrada. Ele vale por pouco tempo — se não achar, olhe também o spam.
        </p>
      </div>
    );
  }

  return (
    <>
      {expirado && (
        <p className="animate-entrada mt-4 rounded-md border border-line bg-surface-2 p-3 text-sm text-ink-muted">
          Seu link expirou ou já foi usado. Peça um novo abaixo.
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            E-mail da conta
          </label>
          <input id="email" type="email" name="email" required autoComplete="email" className={CAMPO} />
        </div>

        {estado?.erro && <p className="animate-entrada text-sm text-warn">{estado.erro}</p>}

        <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} w-full`}>
          {pendente ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>
    </>
  );
}

export default function PaginaEsqueciSenha() {
  return (
    <main className="animate-entrada mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Esqueci minha senha
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Lembrou?{" "}
        <Link href="/entrar" className={LINK_MARCA}>
          Voltar para entrar
        </Link>
      </p>

      <Suspense fallback={null}>
        <FormularioEsqueciSenha />
      </Suspense>
    </main>
  );
}
