import { cookies } from "next/headers";
import PortaDeEntrada from "@/components/PortaDeEntrada";
import VitrineCidade from "@/components/VitrineCidade";
import { listarEstabelecimentos } from "@/lib/estabelecimentos";
import { listarProdutosEmDestaque } from "@/lib/produtos";
import { limparCidade } from "@/lib/actions/cidade";

export default async function PaginaInicial() {
  const cookieStore = await cookies();
  const cidade = cookieStore.get("cidade")?.value;

  if (!cidade) {
    return <PortaDeEntrada />;
  }

  const [estabelecimentos, destaques] = await Promise.all([
    listarEstabelecimentos(cidade),
    listarProdutosEmDestaque(cidade),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            FlashJá em {cidade}
          </h1>
          <p className="mt-1 text-ink-muted">Tudo o que você precisa, conectado à sua cidade.</p>
        </div>
        <form action={limparCidade}>
          <button
            type="submit"
            className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover"
          >
            Trocar cidade
          </button>
        </form>
      </div>
      <span className="mt-3 block h-1 w-12 bg-brand" />

      <VitrineCidade estabelecimentos={estabelecimentos} destaques={destaques} />
    </main>
  );
}
