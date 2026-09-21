"use client";

import { useActionState } from "react";
import { entrarComGoogle } from "@/lib/actions/auth";

const estadoInicial = { erro: null };

// O botão só aparece se o login com Google estiver ligado (ver README). Sem
// essa trava, entre publicar o código e configurar as credenciais no Google
// e no Supabase, o usuário veria um botão que sempre falha.
export const LOGIN_GOOGLE_LIGADO = process.env.NEXT_PUBLIC_LOGIN_GOOGLE === "1";

// Marca do Google. As quatro cores e as proporções são definidas por eles —
// não dá pra recolorir pro verde da FlashJá, é regra de uso da marca.
function LogoGoogle() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

export default function BotaoGoogle({
  proximo = "/",
  rotulo = "Entrar com Google",
}) {
  const [estado, formAction, pendente] = useActionState(
    entrarComGoogle,
    estadoInicial,
  );

  if (!LOGIN_GOOGLE_LIGADO) return null;

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="proximo" value={proximo} />
        <button
          type="submit"
          disabled={pendente}
          className="flex w-full items-center justify-center gap-2.5 rounded-md border border-line bg-surface px-4 py-2 font-medium text-ink shadow-[var(--shadow-card)] transition-[border-color,transform,box-shadow] duration-150 ease-out hover:border-line-strong active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
        >
          <LogoGoogle />
          {pendente ? "Abrindo o Google..." : rotulo}
        </button>
      </form>

      {estado?.erro && (
        <p className="animate-entrada mt-2 text-sm text-warn">{estado.erro}</p>
      )}

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs uppercase tracking-wide text-ink-faint">
          ou
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
