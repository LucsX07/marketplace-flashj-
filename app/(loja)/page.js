import { Suspense } from "react";
import { cookies } from "next/headers";
import PortaDeEntrada from "@/components/PortaDeEntrada";
import VitrineCidade from "@/components/VitrineCidade";
import CampoDeBusca from "@/components/CampoDeBusca";
import ResultadosDaBusca from "@/components/ResultadosDaBusca";
import {
  listarEstabelecimentos,
  buscarEstabelecimentos,
} from "@/lib/estabelecimentos";
import { listarProdutosEmDestaque, buscarProdutos } from "@/lib/produtos";
import { limparCidade } from "@/lib/actions/cidade";

export default async function PaginaInicial({ searchParams }) {
  const cookieStore = await cookies();
  const cidade = cookieStore.get("cidade")?.value;

  if (!cidade) {
    return <PortaDeEntrada />;
  }

  const termo = ((await searchParams)?.busca || "").trim();
  const procurando = termo.length >= 2;

  // Buscando, não carrega a vitrine inteira: são consultas diferentes e a
  // tela mostra uma coisa de cada vez.
  const [estabelecimentos, destaques, produtosAchados, lojasAchadas] =
    await Promise.all([
      procurando ? [] : listarEstabelecimentos(cidade),
      procurando ? [] : listarProdutosEmDestaque(cidade),
      procurando ? buscarProdutos(termo, cidade) : [],
      procurando ? buscarEstabelecimentos(termo, cidade) : [],
    ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            FlashJá em {cidade}
          </h1>
          <p className="mt-1 text-ink-muted">
            Tudo o que você precisa, conectado à sua cidade.
          </p>
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

      {/* useSearchParams precisa de Suspense pra não forçar a página inteira
          a renderizar só no cliente. */}
      <Suspense fallback={null}>
        <CampoDeBusca />
      </Suspense>

      {procurando ? (
        <ResultadosDaBusca
          termo={termo}
          produtos={produtosAchados}
          estabelecimentos={lojasAchadas}
        />
      ) : (
        <VitrineCidade
          estabelecimentos={estabelecimentos}
          destaques={destaques}
        />
      )}
    </main>
  );
}
