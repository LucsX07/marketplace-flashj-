import Link from "next/link";

export default function EstabelecimentoCard({ estabelecimento }) {
  return (
    <Link
      href={`/estabelecimentos/${estabelecimento.id}`}
      className="group block rounded-md border border-line bg-surface p-4 transition hover:border-line-strong"
    >
      {estabelecimento.categorias?.nome && (
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {estabelecimento.categorias.nome}
        </span>
      )}
      <h3 className="mt-1 font-display font-bold text-ink group-hover:text-brand">
        {estabelecimento.nome}
      </h3>
      <p className="text-sm text-ink-muted">{estabelecimento.descricao}</p>
      <p className="mt-2 text-xs text-ink-faint">{estabelecimento.endereco}</p>
    </Link>
  );
}
