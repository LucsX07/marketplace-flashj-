"use client";

import { useActionState } from "react";
import { criarEstabelecimento, atualizarEstabelecimento } from "@/lib/actions/estabelecimentos";
import { BOTAO_PRIMARIO, CAMPO } from "@/lib/ui";

const estadoInicial = { erro: null };

// Sem `estabelecimento`: formulário de cadastro (primeira loja).
// Com `estabelecimento`: mesmo formulário reaproveitado pra editar os
// dados já cadastrados.
export default function FormularioEstabelecimento({ categorias, estabelecimento }) {
  const acao = estabelecimento
    ? atualizarEstabelecimento.bind(null, estabelecimento.id)
    : criarEstabelecimento;
  const [estado, formAction, pendente] = useActionState(acao, estadoInicial);

  return (
    <form action={formAction} className="mt-6 max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink">Nome do estabelecimento</label>
        <input name="nome" required defaultValue={estabelecimento?.nome} className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Categoria</label>
        <select
          name="categoria_id"
          required
          defaultValue={estabelecimento?.categoria_id}
          className={CAMPO}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Descrição</label>
        <input name="descricao" defaultValue={estabelecimento?.descricao || ""} className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Endereço</label>
        <input
          name="endereco"
          required
          defaultValue={estabelecimento?.endereco || ""}
          className={CAMPO}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Cidade</label>
        <input name="cidade" required defaultValue={estabelecimento?.cidade || ""} className={CAMPO} />
      </div>

      {estado?.erro && <p className="animate-entrada text-sm text-warn">{estado.erro}</p>}

      <button type="submit" disabled={pendente} className={BOTAO_PRIMARIO}>
        {pendente
          ? estabelecimento
            ? "Salvando..."
            : "Cadastrando..."
          : estabelecimento
            ? "Salvar alterações"
            : "Cadastrar estabelecimento"}
      </button>
    </form>
  );
}
