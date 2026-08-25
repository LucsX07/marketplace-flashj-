import Link from "next/link";
import { Archivo, Public_Sans } from "next/font/google";
import { CarrinhoProvider } from "@/components/carrinho/CarrinhoContext";
import { criarClienteServidor } from "@/lib/supabase/server";
import { sair } from "@/lib/actions/auth";
import BrandMark from "@/components/BrandMark";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "FlashJá",
  description: "Marketplace de comércio local — conecta consumidores a estabelecimentos",
};

export default async function RootLayout({ children }) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let usuario = null;
  if (user) {
    const { data } = await supabase
      .from("usuarios")
      .select("nome, tipo")
      .eq("id", user.id)
      .maybeSingle();
    usuario = data;
  }

  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <CarrinhoProvider>
          <header className="border-b border-line">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-2">
                <BrandMark className="h-6 w-6 text-brand" />
                <span className="font-display text-lg font-extrabold tracking-tight">
                  Flash<span className="text-brand">Já</span>
                </span>
              </Link>
              <div className="flex items-center gap-5 text-sm font-medium">
                <Link href="/carrinho" className="text-ink-muted hover:text-ink">
                  Carrinho
                </Link>
                {(usuario?.tipo === "comerciante" || usuario?.tipo === "administrador") && (
                  <Link href="/painel" className="text-ink-muted hover:text-ink">
                    Painel
                  </Link>
                )}
                {usuario ? (
                  <form action={sair}>
                    <button type="submit" className="text-ink-muted hover:text-ink">
                      Sair ({usuario.nome})
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/entrar"
                    className="rounded-md bg-brand px-3 py-1.5 text-on-brand hover:bg-brand-hover"
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </nav>
          </header>
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  );
}
