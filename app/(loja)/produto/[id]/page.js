import { notFound } from "next/navigation";
import { buscarProdutoPorId } from "@/lib/produtos";

export default async function PaginaProduto({ params }) {
  const { id } = await params;
  const produto = buscarProdutoPorId(id);

  if (!produto) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">{produto.nome}</h1>
      <p className="mt-2 text-black/60">{produto.descricao}</p>
      <p className="mt-4 text-xl font-semibold">
        {produto.preco.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </main>
  );
}
