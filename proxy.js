import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Renova a sessão do Supabase a cada requisição e protege /painel:
// só comerciante (ou administrador) logado pode acessar.
export async function proxy(request) {
  let resposta = NextResponse.next({ request });

  // Sem credenciais do Supabase ainda (.env.local não preenchido), deixa a
  // página seguir — ela mesma vai mostrar um aviso claro de configuração.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return resposta;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesParaSetar) {
          cookiesParaSetar.forEach(({ name, value }) => request.cookies.set(name, value));
          resposta = NextResponse.next({ request });
          cookiesParaSetar.forEach(({ name, value, options }) =>
            resposta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/painel")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/entrar";
      url.searchParams.set("proximo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const { data: usuario } = await supabase
      .from("usuarios")
      .select("tipo")
      .eq("id", user.id)
      .single();

    if (usuario?.tipo !== "comerciante" && usuario?.tipo !== "administrador") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return resposta;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
