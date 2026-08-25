"use client";

import { useActionState } from "react";
import { criarEstabelecimento } from "@/lib/actions/estabelecimentos";

const estadoInicial = { erro: null };
const campoClasse =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export default function FormularioEstabelecimento({ categorias }) {
  const [estado, formAction, pendente] = useActionState(criarEstabelecimento, estadoInicial);

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink">Nome do estabelecimento</label>
        <input name="nome" required className={campoClasse} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Categoria</label>
        <select name="categoria_id" required className={campoClasse}>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Descrição</label>
        <input name="descricao" className={campoClasse} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Endereço</label>
        <input name="endereco" required className={campoClasse} />
      </div>

      {estado?.erro && <p className="text-sm text-warn">{estado.erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="corner-cut rounded-sm bg-brand px-4 py-2 font-semibold text-on-brand hover:bg-brand-hover disabled:opacity-60"
      >
        {pendente ? "Cadastrando..." : "Cadastrar estabelecimento"}
      </button>
    </form>
  );
}
