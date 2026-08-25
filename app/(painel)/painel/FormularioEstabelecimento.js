"use client";

import { useActionState } from "react";
import { criarEstabelecimento } from "@/lib/actions/estabelecimentos";

const estadoInicial = { erro: null };

export default function FormularioEstabelecimento({ categorias }) {
  const [estado, formAction, pendente] = useActionState(criarEstabelecimento, estadoInicial);

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome do estabelecimento</label>
        <input
          name="nome"
          required
          className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Categoria</label>
        <select
          name="categoria_id"
          required
          className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <input
          name="descricao"
          className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Endereço</label>
        <input
          name="endereco"
          required
          className="mt-1 w-full rounded-md border border-black/20 px-3 py-2"
        />
      </div>

      {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-black/80 disabled:opacity-60"
      >
        {pendente ? "Cadastrando..." : "Cadastrar estabelecimento"}
      </button>
    </form>
  );
}
