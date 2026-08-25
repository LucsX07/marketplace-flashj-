import Link from "next/link";
import { BOTAO_PRIMARIO } from "@/lib/ui";

const BENEFICIOS = [
  {
    titulo: "Presença digital",
    descricao: "Sua loja com uma página própria, visível pra quem procura na sua cidade.",
  },
  {
    titulo: "Novos consumidores",
    descricao: "Apareça pra quem já está buscando um estabelecimento como o seu, perto dali.",
  },
  {
    titulo: "Gestão de produtos",
    descricao: "Cadastre, edite e controle a disponibilidade do seu cardápio quando quiser.",
  },
  {
    titulo: "Gestão de pedidos",
    descricao: "Aceite, recuse e acompanhe cada pedido do início ao fim, num painel só seu.",
  },
];

export default function PaginaVender() {
  return (
    <main className="animate-entrada mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand">
        Para o seu negócio
      </span>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Leve seu negócio para o ecossistema digital da sua cidade
      </h1>
      <p className="mt-3 text-ink-muted">
        A FlashJá conecta o seu estabelecimento a consumidores que já estão
        procurando por perto.
      </p>

      <div className="stagger mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BENEFICIOS.map((beneficio) => (
          <div
            key={beneficio.titulo}
            className="animate-entrada rounded-md border border-line bg-surface p-5"
          >
            <h2 className="font-display font-bold text-ink">{beneficio.titulo}</h2>
            <p className="mt-1 text-sm text-ink-muted">{beneficio.descricao}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/cadastro?tipo=comerciante" className={BOTAO_PRIMARIO}>
          Cadastrar meu negócio
        </Link>
        <Link href="/entrar" className="text-sm font-medium text-brand hover:text-brand-hover">
          Já sou comerciante → Entrar
        </Link>
      </div>
    </main>
  );
}
