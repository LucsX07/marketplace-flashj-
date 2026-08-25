"use client";

import { useActionState } from "react";
import { criarEstabelecimento } from "@/lib/actions/estabelecimentos";
import { BOTAO_PRIMARIO, CAMPO } from "@/lib/ui";

const estadoInicial = { erro: null };

export default function FormularioEstabelecimento({ categorias }) {
  const [estado, formAction, pendente] = useActionState(criarEstabelecimento, estadoInicial);

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink">Nome do estabelecimento</label>
        <input name="nome" required className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Categoria</label>
        <select name="categoria_id" required className={CAMPO}>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Descrição</label>
        <input name="descricao" className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Endereço</label>
        <input name="endereco" required className={CAMPO} />
      </div>

      {estado?.erro && <p className="animate-entrada text-sm text-warn">{estado.erro}</p>}

      <button type="submit" disabled={pendente} className={BOTAO_PRIMARIO}>
        {pendente ? "Cadastrando..." : "Cadastrar estabelecimento"}
      </button>
    </form>
  );
}
