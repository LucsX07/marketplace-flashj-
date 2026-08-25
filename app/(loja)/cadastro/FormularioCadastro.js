"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { cadastrar } from "@/lib/actions/auth";
import { BOTAO_PRIMARIO, CAMPO, LINK_MARCA } from "@/lib/ui";

const estadoInicial = { erro: null, sucesso: false };

export default function FormularioCadastro({ categorias, tipoInicial }) {
  const [tipo, setTipo] = useState(tipoInicial);
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
    <main className="animate-entrada mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Criar conta
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className={LINK_MARCA}>
          Entrar
        </Link>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTipo("consumidor")}
          className={`rounded-md border p-4 text-left transition-colors duration-150 ${
            tipo === "consumidor" ? "border-brand bg-brand-tint" : "border-line bg-surface"
          }`}
        >
          <span className="block font-display font-bold text-ink">🛍️ Comprar</span>
          <span className="mt-1 block text-xs text-ink-muted">
            Encontre produtos da sua cidade.
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTipo("comerciante")}
          className={`rounded-md border p-4 text-left transition-colors duration-150 ${
            tipo === "comerciante" ? "border-brand bg-brand-tint" : "border-line bg-surface"
          }`}
        >
          <span className="block font-display font-bold text-ink">🏪 Vender</span>
          <span className="mt-1 block text-xs text-ink-muted">
            Leve seu negócio pra FlashJá.
          </span>
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="tipo" value={tipo} />

        <div>
          <label className="block text-sm font-medium text-ink">
            {tipo === "comerciante" ? "Nome do responsável" : "Nome"}
          </label>
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

        {tipo === "comerciante" && (
          <div className="animate-entrada space-y-4 rounded-md border border-line bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Sobre o seu negócio
            </p>
            <div>
              <label className="block text-sm font-medium text-ink">Telefone</label>
              <input name="telefone" required className={CAMPO} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Nome do estabelecimento</label>
              <input name="nome_estabelecimento" required className={CAMPO} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Cidade</label>
              <input name="cidade_estabelecimento" required className={CAMPO} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Categoria</label>
              <select name="categoria_id" required className={CAMPO}>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-ink-faint">
              Mais detalhes (descrição, produtos) você adiciona depois, no seu painel.
            </p>
          </div>
        )}

        {estado?.erro && <p className="animate-entrada text-sm text-warn">{estado.erro}</p>}

        <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} w-full`}>
          {pendente
            ? "Criando conta..."
            : tipo === "comerciante"
              ? "Cadastrar meu negócio"
              : "Criar conta"}
        </button>
      </form>
    </main>
  );
}
