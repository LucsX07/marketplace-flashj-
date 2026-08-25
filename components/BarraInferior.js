"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Item({ href, rotulo, ativo, icone }) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors duration-150 ${
        ativo ? "text-brand" : "text-ink-muted"
      }`}
    >
      {icone}
      {rotulo}
    </Link>
  );
}

const ICONE_INICIO = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ICONE_CARRINHO = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h2l2 11h10l2-8H7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

const ICONE_PEDIDOS = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="4" width="14" height="17" rx="1.5" />
    <path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round" />
  </svg>
);

const ICONE_PAINEL = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 10 12 3l8 7" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="10" width="12" height="10" rx="1" />
  </svg>
);

const ICONE_ENTRAR = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="3.3" />
    <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" strokeLinecap="round" />
  </svg>
);

export default function BarraInferior({ usuario }) {
  const pathname = usePathname();
  const ehComerciante = usuario?.tipo === "comerciante" || usuario?.tipo === "administrador";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface sm:hidden">
      <Item href="/" rotulo="Início" ativo={pathname === "/"} icone={ICONE_INICIO} />
      <Item
        href="/carrinho"
        rotulo="Carrinho"
        ativo={pathname === "/carrinho"}
        icone={ICONE_CARRINHO}
      />
      {usuario ? (
        <Item
          href="/pedidos"
          rotulo="Pedidos"
          ativo={pathname.startsWith("/pedidos")}
          icone={ICONE_PEDIDOS}
        />
      ) : (
        <Item href="/entrar" rotulo="Entrar" ativo={pathname === "/entrar"} icone={ICONE_ENTRAR} />
      )}
      {ehComerciante && (
        <Item
          href="/painel"
          rotulo="Painel"
          ativo={pathname.startsWith("/painel")}
          icone={ICONE_PAINEL}
        />
      )}
    </nav>
  );
}
