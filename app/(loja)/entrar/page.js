"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { entrar } from "@/lib/actions/auth";
import { BOTAO_PRIMARIO, CAMPO, LINK_MARCA } from "@/lib/ui";
import BotaoGoogle from "@/components/BotaoGoogle";

const estadoInicial = { erro: null };

function FormularioEntrar() {
  const searchParams = useSearchParams();
  const proximo = searchParams.get("proximo") || "/";
  const linkInvalido = searchParams.get("link") === "invalido";
  const conta = searchParams.get("conta");
  const [estado, formAction, pendente] = useActionState(entrar, estadoInicial);

  return (
    <>
      <div className="mt-6">
        <BotaoGoogle proximo={proximo} />
      </div>

      <form action={formAction} className="space-y-4">
        {conta && (
          <p className="animate-entrada rounded-md border border-line bg-surface-2 p-3 text-sm text-ink-muted">
            {conta === "excluida"
              ? "Sua conta foi excluída. Foi bom ter você por aqui."
              : "Seus dados foram removidos e o acesso a esta conta foi encerrado. Os pedidos que você já fez seguem no histórico do estabelecimento, sem o seu nome."}
          </p>
        )}

        {linkInvalido && (
          <p className="animate-entrada rounded-md border border-line bg-surface-2 p-3 text-sm text-ink-muted">
            Esse link de e-mail expirou ou já foi usado. Entre com sua senha ou
            peça um novo.
          </p>
        )}

        <input type="hidden" name="proximo" value={proximo} />
        <div>
          <label className="block text-sm font-medium text-ink">E-mail</label>
          <input type="email" name="email" required className={CAMPO} />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-ink"
            >
              Senha
            </label>
            <Link href="/esqueci-senha" className={`${LINK_MARCA} text-sm`}>
              Esqueci minha senha
            </Link>
          </div>
          <input
            id="senha"
            type="password"
            name="senha"
            required
            autoComplete="current-password"
            className={CAMPO}
          />
        </div>

        {estado?.erro && (
          <p className="animate-entrada text-sm text-warn">{estado.erro}</p>
        )}

        <button
          type="submit"
          disabled={pendente}
          className={`${BOTAO_PRIMARIO} w-full`}
        >
          {pendente ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
}

export default function PaginaEntrar() {
  return (
    <main className="animate-entrada mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Entrar
      </h1>
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
