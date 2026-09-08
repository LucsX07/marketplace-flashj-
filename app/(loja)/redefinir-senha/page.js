"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redefinirSenha } from "@/lib/actions/auth";
import { BOTAO_PRIMARIO, CAMPO, LINK_MARCA } from "@/lib/ui";

const estadoInicial = { erro: null };

// O usuário só chega aqui vindo do link do e-mail: o /auth/callback já trocou
// o código por uma sessão. Quem entra direto na URL não tem sessão, e a
// própria action devolve "seu link expirou" em vez de trocar senha de ninguém.
export default function PaginaRedefinirSenha() {
  const [estado, formAction, pendente] = useActionState(redefinirSenha, estadoInicial);

  return (
    <main className="animate-entrada mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Criar nova senha
      </h1>
      <p className="mt-1 text-sm text-ink-muted">Pelo menos 6 caracteres.</p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-ink">
            Nova senha
          </label>
          <input
            id="senha"
            type="password"
            name="senha"
            required
            minLength={6}
            autoComplete="new-password"
            className={CAMPO}
          />
        </div>
        <div>
          <label htmlFor="confirmacao" className="block text-sm font-medium text-ink">
            Repita a nova senha
          </label>
          <input
            id="confirmacao"
            type="password"
            name="confirmacao"
            required
            minLength={6}
            autoComplete="new-password"
            className={CAMPO}
          />
        </div>

        {estado?.erro && (
          <div className="animate-entrada">
            <p className="text-sm text-warn">{estado.erro}</p>
            <Link href="/esqueci-senha" className={`${LINK_MARCA} text-sm`}>
              Pedir um novo link
            </Link>
          </div>
        )}

        <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} w-full`}>
          {pendente ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </main>
  );
}
