import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";

// Pra onde o Supabase manda o usuário depois de clicar num link de e-mail:
// confirmação de cadastro (ver emailRedirectTo) ou redefinição de senha
// (ver redirectTo em pedirRedefinicaoDeSenha), ambos em lib/actions/auth.js.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const proximo = searchParams.get("proximo") ?? "/";

  if (code) {
    const supabase = await criarClienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${proximo}`);
    }
  }

  // Link expirado, já usado ou adulterado. Manda pra tela certa em vez de
  // deixar o usuário numa página que vai falhar sem explicar por quê.
  const destinoDoErro =
    proximo === "/redefinir-senha" ? "/esqueci-senha?expirado=1" : "/entrar?link=invalido";

  return NextResponse.redirect(`${origin}${destinoDoErro}`);
}
