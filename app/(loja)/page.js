import ProdutoCard from "@/components/ProdutoCard";
import { produtos } from "@/lib/produtos";

export default function PaginaInicial() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Marketplace</h1>
      <p className="mt-1 text-black/60">Confira os produtos disponíveis.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {produtos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </main>
  );
}
