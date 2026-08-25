import { buscarProdutosPorEstabelecimento } from "@/lib/produtos";

// Até termos login de comerciante (com Supabase Auth), fixamos o
// estabelecimento de exemplo para o qual este painel mostra os produtos.
const ESTABELECIMENTO_DEMO_ID = "1";

export default function PainelProdutos() {
  const produtos = buscarProdutosPorEstabelecimento(ESTABELECIMENTO_DEMO_ID);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <p className="mt-1 text-black/60">
        Cadastro completo de produtos chega na próxima etapa, com o banco de dados real.
      </p>

      <ul className="mt-6 divide-y divide-black/10">
        {produtos.map((produto) => (
          <li key={produto.id} className="flex items-center justify-between py-3">
            <span>{produto.nome}</span>
            <span className="text-black/60">
              {produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
