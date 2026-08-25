import Link from "next/link";

export default function EstabelecimentoCard({ estabelecimento }) {
  return (
    <Link
      href={`/estabelecimentos/${estabelecimento.id}`}
      className="group animate-entrada block rounded-md border border-line bg-surface p-4 transition-[border-color,transform] duration-150 ease-out hover:border-brand active:scale-[0.99]"
    >
      {estabelecimento.categorias?.nome && (
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {estabelecimento.categorias.nome}
        </span>
      )}
      <h3 className="mt-1 font-display font-bold text-ink transition-colors duration-150 group-hover:text-brand">
        {estabelecimento.nome}
      </h3>
      <p className="text-sm text-ink-muted">{estabelecimento.descricao}</p>
      <p className="mt-2 text-xs text-ink-faint">{estabelecimento.endereco}</p>
    </Link>
  );
}
