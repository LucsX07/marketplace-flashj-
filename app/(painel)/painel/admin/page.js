import Link from "next/link";
import { notFound } from "next/navigation";
import { listarCategoriasParaAdmin, souAdministrador } from "@/lib/categorias";
import GerenciarCategorias from "./GerenciarCategorias";

export default async function PainelAdmin() {
  // O proxy já barra quem não é administrador, mas a checagem se repete aqui:
  // o proxy pode ser reconfigurado, e a página não deveria depender disso pra
  // não vazar. Quem não é admin recebe 404, não "acesso negado" — não há
  // motivo de contar que esta tela existe.
  if (!(await souAdministrador())) notFound();

  const categorias = await listarCategoriasParaAdmin();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/painel"
        className="text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
      >
        ← Painel
      </Link>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink">
        Administração
      </h1>
      <p className="mt-1 text-ink-muted">
        Categorias da plataforma — o que aparece para quem vai cadastrar uma
        loja.
      </p>

      <GerenciarCategorias categorias={categorias} />
    </main>
  );
}
