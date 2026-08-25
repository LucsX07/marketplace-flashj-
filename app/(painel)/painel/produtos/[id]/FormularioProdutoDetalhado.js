"use client";

import { useActionState, useRef, useTransition } from "react";
import {
  atualizarProduto,
  criarAtributo,
  removerAtributo,
  criarOpcao,
  removerOpcao,
  criarValorOpcao,
  removerValorOpcao,
} from "@/lib/actions/produtos";
import { formatarPreco } from "@/lib/formatar";
import { BOTAO_PRIMARIO, BOTAO_SECUNDARIO, CAMPO, CARTAO } from "@/lib/ui";

const estadoInicial = { erro: null };

function Chip({ texto, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-muted transition-colors duration-150 hover:border-brand hover:text-brand"
    >
      {texto}
    </button>
  );
}

function BotaoRemover({ acao, pendente }) {
  return (
    <button
      type="button"
      onClick={acao}
      disabled={pendente}
      className="text-xs font-medium text-ink-faint transition-colors duration-150 hover:text-warn disabled:opacity-60"
    >
      Remover
    </button>
  );
}

function SecaoBase({ produto }) {
  const acao = atualizarProduto.bind(null, produto.id);
  const [estado, formAction, pendente] = useActionState(acao, estadoInicial);

  return (
    <form action={formAction} className={`${CARTAO} animate-entrada mt-6 p-4`}>
      <h2 className="font-semibold text-ink">Dados do produto</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Nome</label>
          <input name="nome" required defaultValue={produto.nome} className={CAMPO} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Preço (R$)</label>
          <input
            name="preco"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={produto.preco}
            className={CAMPO}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium text-ink">Descrição</label>
        <input name="descricao" defaultValue={produto.descricao || ""} className={CAMPO} />
      </div>

      <details className="mt-4 rounded-md border border-line p-3">
        <summary className="cursor-pointer text-sm font-medium text-ink-muted">
          Mais informações
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">
              Preço promocional (R$)
            </label>
            <input
              name="preco_promocional"
              type="number"
              step="0.01"
              min="0"
              defaultValue={produto.preco_promocional ?? ""}
              placeholder="Opcional"
              className={CAMPO}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">
              Categoria dentro da loja
            </label>
            <input
              name="categoria_produto"
              defaultValue={produto.categoria_produto || ""}
              placeholder="Ex.: Bebidas"
              className={CAMPO}
            />
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input
            name="em_destaque"
            type="checkbox"
            defaultChecked={produto.em_destaque}
            className="h-4 w-4 rounded border-line accent-brand"
          />
          Destacar este produto na loja
        </label>
      </details>

      {estado?.erro && <p className="animate-entrada mt-2 text-sm text-warn">{estado.erro}</p>}

      <button type="submit" disabled={pendente} className={`${BOTAO_PRIMARIO} mt-4 text-sm`}>
        {pendente ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}

function FormularioAtributo({ produtoId, sugestoes }) {
  const acao = criarAtributo.bind(null, produtoId);
  const [estado, formAction, pendente] = useActionState(acao, estadoInicial);
  const nomeRef = useRef(null);

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm font-medium text-ink">Nome</label>
        <input ref={nomeRef} name="nome" required placeholder="Marca" className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Valor</label>
        <input name="valor" required placeholder="Marca X" className={CAMPO} />
      </div>
      <button type="submit" disabled={pendente} className={`${BOTAO_SECUNDARIO} text-sm`}>
        {pendente ? "Adicionando..." : "Adicionar atributo"}
      </button>
      {sugestoes.length > 0 && (
        <div className="flex w-full flex-wrap gap-2">
          {sugestoes.map((sugestao) => (
            <Chip
              key={sugestao}
              texto={sugestao}
              onClick={() => {
                if (nomeRef.current) nomeRef.current.value = sugestao;
              }}
            />
          ))}
        </div>
      )}
      {estado?.erro && <p className="animate-entrada w-full text-sm text-warn">{estado.erro}</p>}
    </form>
  );
}

function SecaoAtributos({ produto, sugestoes }) {
  const [pendente, iniciarTransicao] = useTransition();

  function remover(atributoId) {
    iniciarTransicao(async () => {
      await removerAtributo(produto.id, atributoId);
    });
  }

  return (
    <div className={`${CARTAO} animate-entrada mt-4 p-4`}>
      <h2 className="font-semibold text-ink">Atributos</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Informações do produto que não mudam o preço — marca, peso, material...
      </p>

      {produto.produto_atributos?.length > 0 && (
        <ul className="stagger mt-3 divide-y divide-line">
          {produto.produto_atributos.map((atributo) => (
            <li key={atributo.id} className="animate-entrada flex items-center justify-between py-2">
              <span className="text-sm text-ink">
                <span className="font-medium">{atributo.nome}:</span> {atributo.valor}
              </span>
              <BotaoRemover acao={() => remover(atributo.id)} pendente={pendente} />
            </li>
          ))}
        </ul>
      )}

      <FormularioAtributo produtoId={produto.id} sugestoes={sugestoes.atributos} />
    </div>
  );
}

function FormularioValorOpcao({ produtoId, opcaoId }) {
  const acao = criarValorOpcao.bind(null, produtoId, opcaoId);
  const [estado, formAction, pendente] = useActionState(acao, estadoInicial);

  return (
    <form action={formAction} className="mt-2 flex flex-wrap items-end gap-2">
      <input name="nome" required placeholder="Grande" className={`${CAMPO} w-32`} />
      <input
        name="ajuste_preco"
        type="number"
        step="0.01"
        placeholder="+0.00"
        className={`${CAMPO} w-24`}
      />
      <button type="submit" disabled={pendente} className="text-sm font-medium text-brand hover:text-brand-hover disabled:opacity-60">
        {pendente ? "Adicionando..." : "+ valor"}
      </button>
      {estado?.erro && <p className="animate-entrada w-full text-sm text-warn">{estado.erro}</p>}
    </form>
  );
}

function GrupoOpcao({ produtoId, opcao }) {
  const [pendente, iniciarTransicao] = useTransition();

  function removerEsteValor(valorId) {
    iniciarTransicao(async () => {
      await removerValorOpcao(produtoId, valorId);
    });
  }

  function removerEstaOpcao() {
    iniciarTransicao(async () => {
      await removerOpcao(produtoId, opcao.id);
    });
  }

  return (
    <div className="rounded-md border border-line p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">
          {opcao.nome}{" "}
          <span className="text-ink-faint">
            ({opcao.tipo === "multipla" ? "múltipla escolha" : "escolha única"}
            {opcao.obrigatoria ? ", obrigatória" : ""})
          </span>
        </span>
        <BotaoRemover acao={removerEstaOpcao} pendente={pendente} />
      </div>

      {opcao.produto_opcao_valores?.length > 0 && (
        <ul className="mt-2 divide-y divide-line">
          {opcao.produto_opcao_valores.map((valor) => (
            <li key={valor.id} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-ink">
                {valor.nome}
                {valor.ajuste_preco ? (
                  <span className="ml-1 text-ink-muted">
                    ({valor.ajuste_preco > 0 ? "+" : ""}
                    {formatarPreco(valor.ajuste_preco)})
                  </span>
                ) : null}
              </span>
              <BotaoRemover acao={() => removerEsteValor(valor.id)} pendente={pendente} />
            </li>
          ))}
        </ul>
      )}

      <FormularioValorOpcao produtoId={produtoId} opcaoId={opcao.id} />
    </div>
  );
}

function FormularioOpcao({ produtoId, sugestoes }) {
  const acao = criarOpcao.bind(null, produtoId);
  const [estado, formAction, pendente] = useActionState(acao, estadoInicial);
  const nomeRef = useRef(null);

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm font-medium text-ink">Nome</label>
        <input ref={nomeRef} name="nome" required placeholder="Tamanho" className={CAMPO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink">Tipo</label>
        <select name="tipo" className={CAMPO} defaultValue="unica">
          <option value="unica">Escolha única</option>
          <option value="multipla">Múltipla escolha</option>
        </select>
      </div>
      <label className="flex items-center gap-2 pb-2 text-sm text-ink">
        <input name="obrigatoria" type="checkbox" className="h-4 w-4 rounded border-line accent-brand" />
        Obrigatória
      </label>
      <button type="submit" disabled={pendente} className={`${BOTAO_SECUNDARIO} text-sm`}>
        {pendente ? "Adicionando..." : "Adicionar opção"}
      </button>
      {sugestoes.length > 0 && (
        <div className="flex w-full flex-wrap gap-2">
          {sugestoes.map((sugestao) => (
            <Chip
              key={sugestao}
              texto={sugestao}
              onClick={() => {
                if (nomeRef.current) nomeRef.current.value = sugestao;
              }}
            />
          ))}
        </div>
      )}
      {estado?.erro && <p className="animate-entrada w-full text-sm text-warn">{estado.erro}</p>}
    </form>
  );
}

function SecaoOpcoes({ produto, sugestoes }) {
  return (
    <div className={`${CARTAO} animate-entrada mt-4 p-4`}>
      <h2 className="font-semibold text-ink">Opções e variações</h2>
      <p className="mt-1 text-sm text-ink-muted">
        O que o consumidor escolhe ao comprar — tamanho, adicionais, cor... pode mudar o preço.
      </p>

      {produto.produto_opcoes?.length > 0 && (
        <div className="stagger mt-3 space-y-3">
          {produto.produto_opcoes.map((opcao) => (
            <div key={opcao.id} className="animate-entrada">
              <GrupoOpcao produtoId={produto.id} opcao={opcao} />
            </div>
          ))}
        </div>
      )}

      <FormularioOpcao produtoId={produto.id} sugestoes={sugestoes.opcoes} />
    </div>
  );
}

export default function FormularioProdutoDetalhado({ produto, sugestoes }) {
  return (
    <>
      <SecaoBase produto={produto} />
      <SecaoAtributos produto={produto} sugestoes={sugestoes} />
      <SecaoOpcoes produto={produto} sugestoes={sugestoes} />
    </>
  );
}
