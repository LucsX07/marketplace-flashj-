import Link from "next/link";

export default function EstabelecimentoCard({ estabelecimento }) {
  return (
    <Link
      href={`/estabelecimentos/${estabelecimento.id}`}
      className="block rounded-lg border border-black/10 p-4 transition hover:shadow-md"
    >
      <span className="text-xs font-medium uppercase text-black/40">
        {estabelecimento.categoria}
      </span>
      <h3 className="mt-1 font-semibold">{estabelecimento.nome}</h3>
      <p className="text-sm text-black/60">{estabelecimento.descricao}</p>
      <p className="mt-2 text-xs text-black/40">{estabelecimento.endereco}</p>
    </Link>
  );
}
