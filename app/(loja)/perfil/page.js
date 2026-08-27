import Link from "next/link";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { sair } from "@/lib/actions/auth";
import SeletorDeTema from "@/components/SeletorDeTema";
import { CARTAO, CARTAO_INTERATIVO, LINK_MARCA } from "@/lib/ui";

export default async function PaginaPerfil() {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar?proximo=/perfil");
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nome, tipo")
    .eq("id", user.id)
    .maybeSingle();

  const ehComerciante = usuario?.tipo === "comerciante" || usuario?.tipo === "administrador";

  return (
    <main className="animate-entrada mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        Olá, {usuario?.nome}
      </h1>

      <div className="stagger mt-8 space-y-4">
        <Link href="/pedidos" className={`${CARTAO_INTERATIVO} animate-entrada block p-4`}>
          <h2 className="font-display font-bold text-ink">Meus pedidos</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Acompanhe e veja o histórico das suas compras.
          </p>
        </Link>

        {ehComerciante && (
          <Link href="/painel" className={`${CARTAO_INTERATIVO} animate-entrada block p-4`}>
            <h2 className="font-display font-bold text-ink">Painel do comerciante</h2>
            <p className="mt-1 text-sm text-ink-muted">Gerencie sua loja, produtos e pedidos.</p>
          </Link>
        )}

        <div className={`${CARTAO} animate-entrada p-4`}>
          <SeletorDeTema />
        </div>

        <form action={sair} className="animate-entrada pt-2">
          <button type="submit" className={LINK_MARCA}>
            Sair
          </button>
        </form>
      </div>
    </main>
  );
}
