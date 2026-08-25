import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CarrinhoProvider } from "@/components/carrinho/CarrinhoContext";
import { criarClienteServidor } from "@/lib/supabase/server";
import { sair } from "@/lib/actions/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CarrinhoProvider>
          <header className="border-b border-black/10">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-bold">
                FlashJá
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/carrinho">Carrinho</Link>
                {(usuario?.tipo === "comerciante" || usuario?.tipo === "administrador") && (
                  <Link href="/painel">Painel do comerciante</Link>
                )}
                {usuario ? (
                  <form action={sair}>
                    <button type="submit" className="underline">
                      Sair ({usuario.nome})
                    </button>
                  </form>
                ) : (
                  <Link href="/entrar">Entrar</Link>
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
