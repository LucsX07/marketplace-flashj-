import Link from "next/link";

export default function ProdutoCard({ produto }) {
  return (
    <Link
      href={`/produto/${produto.id}`}
      className="block rounded-lg border border-black/10 p-4 transition hover:shadow-md"
    >
      <h3 className="font-semibold">{produto.nome}</h3>
      <p className="text-sm text-black/60">{produto.descricao}</p>
      <p className="mt-2 font-medium">
        {produto.preco.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </Link>
  );
}
