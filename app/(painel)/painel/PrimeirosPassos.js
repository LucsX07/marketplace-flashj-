import Link from "next/link";
import { CARTAO } from "@/lib/ui";

// Três zeros ("0 pedidos, R$ 0,00, 0 produtos") é o que um comerciante novo
// via ao entrar no painel pela primeira vez. Tecnicamente correto e
// completamente inútil: não diz o que fazer pra sair dali. Enquanto faltar
// algum passo, esse roteiro aparece no lugar dos números — e cada item sabe
// se já foi feito, então não é um checklist decorativo.
function Passo({ numero, feito, titulo, descricao, href, rotuloDoLink }) {
  return (
    <li className="flex gap-3 py-3">
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          feito ? "bg-brand text-on-brand" : "bg-surface-2 text-ink-muted"
        }`}
      >
        {feito ? "✓" : numero}
      </span>
      <div className="min-w-0">
        <p
          className={`text-sm font-medium ${feito ? "text-ink-faint line-through" : "text-ink"}`}
        >
          {titulo}
          <span className="sr-only">{feito ? " (feito)" : " (pendente)"}</span>
        </p>
        {!feito && (
          <>
            <p className="mt-0.5 text-sm text-ink-muted">{descricao}</p>
            <Link
              href={href}
              className="mt-1 inline-block text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover"
            >
              {rotuloDoLink} →
            </Link>
          </>
        )}
      </div>
    </li>
  );
}

export default function PrimeirosPassos({ temProduto, temCapa, estaAberta }) {
  const quantosFaltam = [temProduto, temCapa, estaAberta].filter(
    (feito) => !feito,
  ).length;

  return (
    <section className={`${CARTAO} animate-entrada mt-6 p-4`}>
      <h2 className="font-display font-bold text-ink">Para começar a vender</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {quantosFaltam === 1
          ? "Falta um passo para sua loja aparecer para os clientes."
          : `Faltam ${quantosFaltam} passos para sua loja aparecer para os clientes.`}
      </p>

      <ul className="mt-2 divide-y divide-line">
        <Passo
          numero="1"
          feito={temProduto}
          titulo="Cadastrar o primeiro produto"
          descricao="Sem produto, não há o que comprar na sua loja."
          href="/painel/produtos"
          rotuloDoLink="Cadastrar produto"
        />
        <Passo
          numero="2"
          feito={temCapa}
          titulo="Colocar uma foto de capa"
          descricao="É a primeira coisa que o cliente vê na vitrine da cidade."
          href="/painel/loja"
          rotuloDoLink="Enviar foto"
        />
        <Passo
          numero="3"
          feito={estaAberta}
          titulo="Abrir a loja"
          descricao="Com a loja fechada ninguém consegue fazer pedido."
          href="/painel/loja"
          rotuloDoLink="Abrir agora"
        />
      </ul>
    </section>
  );
}
