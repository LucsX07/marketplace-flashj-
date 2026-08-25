"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cadastrar } from "@/lib/actions/auth";
import { BOTAO_PRIMARIO, CAMPO, LINK_MARCA } from "@/lib/ui";

const estadoInicial = { erro: null, sucesso: false };

export default function PaginaCadastro() {
  const [estado, formAction, pendente] = useActionState(cadastrar, estadoInicial);

  if (estado?.sucesso) {
    return (
      <main className="animate-entrada mx-auto max-w-sm px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Quase lá!
        </h1>
        <p className="mt-4 text-ink-muted">
          Enviamos um link de confirmação para o seu e-mail. Clique nele para
          ativar a conta e depois volte para{" "}
          <Link href="/entrar" className={LINK_MARCA}>
            entrar
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="animate-entrada mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Criar conta
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className={LINK_MARCA}>
          Entrar
        </Link>
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink">Eu quero</label>
          <select name="tipo" defaultValue="consumidor" className={CAMPO}>
            <option value="consumidor">Comprar (consumidor)</option>
            <option value="comerciante">Vender (comerciante)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Nome</label>
          <input name="nome" required className={CAMPO} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">E-mail</label>
          <input type="email" name="email" required className={CAMPO} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Senha</label>
          <input type="password" name="senha" required minLength={6} className={CAMPO} />
        </div>

        {estado?.erro && <p className="animate-entrada text-sm text-warn">{estado.erro}</p>}

        <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} w-full`}>
          {pendente ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </main>
  );
}
