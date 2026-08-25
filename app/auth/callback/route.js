import { NextResponse } from "next/server";
import { criarClienteServidor } from "@/lib/supabase/server";

// Pra onde o Supabase manda o usuário depois de clicar no link de
// confirmação de e-mail (ver emailRedirectTo em lib/actions/auth.js).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const proximo = searchParams.get("proximo") ?? "/";

  if (code) {
    const supabase = await criarClienteServidor();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${proximo}`);
}
