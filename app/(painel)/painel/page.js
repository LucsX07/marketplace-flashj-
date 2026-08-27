import Link from "next/link";
import { criarClienteServidor } from "@/lib/supabase/server";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarCategorias } from "@/lib/categorias";
import { listarTodosProdutosDoEstabelecimento } from "@/lib/produtos";
import { resumoDoDia } from "@/lib/pedidos";
import { criarEstabelecimentoAutomatico } from "@/lib/actions/estabelecimentos";
import { formatarPreco } from "@/lib/formatar";
import { CARTAO, CARTAO_INTERATIVO } from "@/lib/ui";
import FormularioEstabelecimento from "./FormularioEstabelecimento";

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function PainelInicial() {
  let estabelecimento = await buscarMeuEstabelecimento();

  // Comerciante que preencheu os dados do negócio já no cadastro (ver
  // FormularioCadastro) não precisa preencher de novo — tenta criar direto
  // a partir dos metadados salvos na conta.
  if (!estabelecimento) {
    estabelecimento = await criarEstabelecimentoAutomatico();
  }

  if (!estabelecimento) {
    const categorias = await listarCategorias();
    return (
      <main className="animate-entrada mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Cadastre seu estabelecimento
        </h1>
        <p className="mt-1 text-ink-muted">
          Antes de gerenciar produtos e pedidos, cadastre a sua loja.
        </p>
        <FormularioEstabelecimento categorias={categorias} />
      </main>
    );
  }

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nome")
    .eq("id", user.id)
    .maybeSingle();

  const [{ pedidosHoje, receitaHoje }, produtos] = await Promise.all([
    resumoDoDia(estabelecimento.id),
    listarTodosProdutosDoEstabelecimento(estabelecimento.id),
  ]);

  return (
    <main className="animate-entrada mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {saudacaoPorHorario()}, {usuario?.nome}!
      </h1>
      <p className="mt-1 text-ink-muted">{estabelecimento.nome}</p>

      <div className={`${CARTAO} animate-entrada mt-6 grid grid-cols-3 divide-x divide-line`}>
        <div className="p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-ink">{pedidosHoje}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {pedidosHoje === 1 ? "pedido hoje" : "pedidos hoje"}
          </p>
        </div>
        <div className="p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-ink">
            {formatarPreco(receitaHoje)}
          </p>
          <p className="mt-1 text-xs text-ink-muted">hoje</p>
        </div>
        <div className="p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-ink">{produtos.length}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {produtos.length === 1 ? "produto" : "produtos"}
          </p>
        </div>
      </div>

      <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/painel/pedidos" className={`${CARTAO_INTERATIVO} animate-entrada p-4`}>
          <h2 className="font-display font-bold text-ink">Pedidos recebidos</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Aceite, recuse e atualize o status dos pedidos.
          </p>
        </Link>
        <Link href="/painel/produtos" className={`${CARTAO_INTERATIVO} animate-entrada p-4`}>
          <h2 className="font-display font-bold text-ink">Produtos</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Gerencie o cardápio do seu estabelecimento.
          </p>
        </Link>
        <Link href="/painel/loja" className={`${CARTAO_INTERATIVO} animate-entrada p-4`}>
          <h2 className="font-display font-bold text-ink">Minha loja</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Capa, dados da loja e se está aberta agora.
          </p>
        </Link>
      </div>
    </main>
  );
}
