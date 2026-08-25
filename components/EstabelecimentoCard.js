import Link from "next/link";
import ImagemComPlaceholder from "@/components/ImagemComPlaceholder";

export default function EstabelecimentoCard({ estabelecimento }) {
  return (
    <Link
      href={`/estabelecimentos/${estabelecimento.id}`}
      className="group animate-entrada block overflow-hidden rounded-md border border-line bg-surface transition-[border-color,transform] duration-150 ease-out hover:border-brand active:scale-[0.99]"
    >
      <div className="relative">
        <ImagemComPlaceholder src={estabelecimento.capa_url} alt={estabelecimento.nome} className="h-28 w-full" />
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            estabelecimento.aberto_agora
              ? "bg-brand-tint text-brand"
              : "bg-warn-tint text-warn"
          }`}
        >
          {estabelecimento.aberto_agora ? "Aberto" : "Fechado"}
        </span>
      </div>

      <div className="p-4">
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
      </div>
    </Link>
  );
}
