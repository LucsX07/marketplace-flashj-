"use client";

import Link from "next/link";
import { useActionState } from "react";
import BrandMark from "@/components/BrandMark";
import { definirCidade } from "@/lib/actions/cidade";
import { BOTAO_PRIMARIO, BOTAO_SECUNDARIO, CAMPO } from "@/lib/ui";

const estadoInicial = { erro: null };

export default function PortaDeEntrada() {
  const [estado, formAction, pendente] = useActionState(definirCidade, estadoInicial);

  return (
    <main className="animate-entrada mx-auto max-w-lg px-4 py-14 text-center sm:px-6 sm:py-20">
      <BrandMark className="mx-auto h-10 w-10 text-brand" />
      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Flash<span className="text-brand">Já</span>
      </h1>
      <p className="mt-2 text-ink-muted">Entregando futuro ao mundo.</p>
      <p className="mx-auto mt-4 max-w-sm text-sm text-ink-muted">
        A FlashJá conecta consumidores e negócios locais num único
        ecossistema — tudo o que você precisa, perto de você.
      </p>

      <div className="relative mt-10 overflow-hidden rounded-md border border-line bg-surface p-6 text-left">
        <div className="grid-texture pointer-events-none absolute inset-0" />
        <div className="relative">
          <h2 className="font-display font-bold text-ink">Onde você está?</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Digite sua cidade ou CEP pra ver o que está disponível na sua região.
          </p>

          <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              name="cidade"
              placeholder="Cidade ou CEP"
              required
              className={`${CAMPO} mt-0 sm:flex-1`}
            />
            <button type="submit" disabled={pendente} className={BOTAO_PRIMARIO}>
              {pendente ? "Buscando..." : "Continuar"}
            </button>
          </form>
          {estado?.erro && <p className="animate-entrada mt-2 text-sm text-warn">{estado.erro}</p>}
        </div>
      </div>

      <div className="animate-entrada mt-6 rounded-md border border-line bg-surface p-6 text-left">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          Tem um negócio?
        </span>
        <h2 className="mt-1 font-display font-bold text-ink">Leve seu negócio para a FlashJá</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Presença digital, novos consumidores e gestão de produtos e pedidos
          num só lugar.
        </p>
        <Link href="/vender" className={`${BOTAO_SECUNDARIO} mt-4 inline-block`}>
          Quero vender
        </Link>
      </div>
    </main>
  );
}
