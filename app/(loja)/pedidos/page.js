import Link from "next/link";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { listarMeusPedidos } from "@/lib/pedidos";
import PedidoResumoCard from "@/components/PedidoResumoCard";
import BrandMark from "@/components/BrandMark";
import { BOTAO_PRIMARIO } from "@/lib/ui";

export default async function PaginaMeusPedidos() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar?proximo=/pedidos");
  }

  const pedidos = await listarMeusPedidos();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Meus pedidos
      </h1>
      <span className="mt-3 block h-1 w-12 bg-brand" />

      {pedidos.length === 0 ? (
        <div className="animate-entrada relative mt-8 overflow-hidden rounded-md border border-line bg-surface p-10 text-center">
          <div className="grid-texture pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col items-center">
            <BrandMark className="h-10 w-10 text-brand" />
            <p className="mt-4 font-display font-bold text-ink">
              Você ainda não fez nenhum pedido
            </p>
            <p className="mt-1 max-w-xs text-sm text-ink-muted">
              Escolha um estabelecimento perto de você e peça algo — seu histórico aparece aqui.
            </p>
            <Link href="/" className={`${BOTAO_PRIMARIO} mt-6 inline-block`}>
              Explorar estabelecimentos
            </Link>
          </div>
        </div>
      ) : (
        <ul className="stagger mt-8 space-y-4">
          {pedidos.map((pedido) => (
            <PedidoResumoCard key={pedido.id} pedido={pedido} />
          ))}
        </ul>
      )}
    </main>
  );
}
