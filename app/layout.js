import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CarrinhoProvider } from "@/components/carrinho/CarrinhoContext";
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

export default function RootLayout({ children }) {
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
              <div className="flex gap-4 text-sm">
                <Link href="/carrinho">Carrinho</Link>
                <Link href="/painel">Painel do comerciante</Link>
              </div>
            </nav>
          </header>
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  );
}
