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
    <main className="pb-4">
      {/* A faixa de grafite existe por um motivo estrutural, não decorativo:
          sem ela a página inteira flutuava num bege claro e nada ancorava a
          vista. O bloco escuro dá um começo à leitura, separa "onde estou"
          de "o que tem aqui", e é onde a busca mora — que é a primeira coisa
          que alguém faz num marketplace. */}
      <section className="bg-graphite text-on-graphite">
        <div className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-on-graphite-muted">
                Você está em
              </p>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-on-graphite sm:text-5xl">
                {cidade}
              </h1>
            </div>
            <form action={limparCidade}>
              <button
                type="submit"
                className="rounded-full border border-on-graphite-muted/30 px-3 py-1.5 text-sm font-medium text-on-graphite-muted transition-colors duration-150 hover:border-on-graphite-muted/60 hover:text-on-graphite"
              >
                Trocar cidade
              </button>
            </form>
          </div>

          <Suspense fallback={null}>
            <CampoDeBusca />
          </Suspense>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
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
      </div>
    </main>
  );
}
