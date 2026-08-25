import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente usado em Server Components, Server Actions e Route Handlers.
// Lê/escreve o cookie de sessão do usuário logado.
export async function criarClienteServidor() {
  // Chamar cookies() incondicionalmente, antes de qualquer verificação,
  // garante que o Next.js sempre trate a rota como dinâmica (nunca tenta
  // pré-renderizar isso em build time) — inclusive quando o erro abaixo
  // é lançado.
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase não configurado: preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local (veja o README)."
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesParaSetar) {
          try {
            cookiesParaSetar.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component: o middleware já
            // cuida de renovar a sessão, então é seguro ignorar aqui.
          }
        },
      },
    }
  );
}
