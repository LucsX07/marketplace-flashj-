import { createBrowserClient } from "@supabase/ssr";

// Cliente usado só no navegador, e hoje só pra uma coisa: ouvir o Realtime
// (pedido novo chegando no painel). Todo o resto do app continua passando
// pelo cliente de servidor — este aqui não busca nem grava dado nenhum.
export function criarClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
