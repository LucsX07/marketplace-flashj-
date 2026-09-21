"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  criarCategoria,
  renomearCategoria,
  alternarCategoriaAtiva,
  excluirCategoria,
} from "@/lib/actions/categorias";
import {
  BOTAO_DESTRUTIVO,
  BOTAO_PRIMARIO,
  BOTAO_SECUNDARIO,
  CAMPO,
  CARTAO,
} from "@/lib/ui";

const estadoInicial = { erro: null, sucesso: false };

function FormularioNovaCategoria() {
  const [estado, formAction, pendente] = useActionState(
    criarCategoria,
    estadoInicial,
  );
  const formRef = useRef(null);

  // Limpa o campo por fora do React depois de salvar. Zerar por estado exigiria
  // mexer em state dentro de efeito, que o lint do projeto não aceita.
  useEffect(() => {
    if (estado?.sucesso) formRef.current?.reset();
  }, [estado?.sucesso]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={`${CARTAO} animate-entrada mt-6 p-4`}
    >
      <h2 className="font-display font-bold text-ink">Nova categoria</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Aparece para quem está cadastrando uma loja. Ex.: Pet Shop, Bazar,
        Padaria.
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="nova-categoria"
            className="block text-sm font-medium text-ink"
          >
            Nome
          </label>
          <input
            id="nova-categoria"
            name="nome"
            required
            minLength={2}
            maxLength={40}
            autoComplete="off"
            className={CAMPO}
          />
        </div>
        <button
          type="submit"
          disabled={pendente}
          className={`${BOTAO_PRIMARIO} text-sm`}
        >
          {pendente ? "Criando..." : "Criar"}
        </button>
      </div>

      {estado?.erro && (
        <p className="animate-entrada mt-2 text-sm text-warn">{estado.erro}</p>
      )}
      {estado?.sucesso && (
        <p
          role="status"
          className="animate-entrada mt-2 text-sm font-medium text-brand"
        >
          Categoria criada.
        </p>
      )}
    </form>
  );
}

function LinhaCategoria({ categoria }) {
  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [erro, setErro] = useState(null);
  const [pendente, iniciarTransicao] = useTransition();

  const renomear = renomearCategoria.bind(null, categoria.id);
  const [estadoRenome, acaoRenomear, renomeando] = useActionState(
    renomear,
    estadoInicial,
  );

  // Não fecho o formulário de renomear por efeito: quando o nome salva, a
  // action revalida a tela, o nome novo chega do servidor e a `key` desta
  // linha muda (ver a lista abaixo). React remonta a linha e o modo de edição
  // se desfaz sozinho — sem mexer em estado dentro de efeito.

  function executar(acao) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await acao();
      if (resultado?.erro) {
        setErro(resultado.erro);
        setConfirmandoExclusao(false);
      }
    });
  }

  const emUso = categoria.lojas > 0;

  return (
    <li className="animate-entrada py-3">
      {editando ? (
        <form action={acaoRenomear} className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor={`nome-${categoria.id}`} className="sr-only">
              Novo nome para {categoria.nome}
            </label>
            <input
              id={`nome-${categoria.id}`}
              name="nome"
              defaultValue={categoria.nome}
              required
              minLength={2}
              maxLength={40}
              autoComplete="off"
              className={CAMPO}
            />
          </div>
          <button
            type="submit"
            disabled={renomeando}
            className={`${BOTAO_PRIMARIO} text-sm`}
          >
            {renomeando ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className={`${BOTAO_SECUNDARIO} text-sm`}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <span
              className={
                categoria.ativo ? "text-ink" : "text-ink-faint line-through"
              }
            >
              {categoria.nome}
            </span>
            {!categoria.ativo && (
              <span className="ml-2 rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                Desativada
              </span>
            )}
            <span className="block text-xs text-ink-muted">
              {emUso
                ? `${categoria.lojas} ${categoria.lojas === 1 ? "loja usa" : "lojas usam"}`
                : "nenhuma loja usa"}
            </span>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
            >
              Renomear
            </button>
            <button
              type="button"
              disabled={pendente}
              onClick={() =>
                executar(() =>
                  alternarCategoriaAtiva(categoria.id, !categoria.ativo),
                )
              }
              className="text-sm font-medium text-brand transition-transform duration-150 hover:text-brand-hover active:scale-[0.97] disabled:opacity-60"
            >
              {categoria.ativo ? "Desativar" : "Reativar"}
            </button>

            {/* Excluir só aparece pra categoria que ninguém usa. O banco recusa
                as outras de qualquer jeito, mas mostrar um botão que sempre
                falha é pior do que não mostrar. */}
            {!emUso &&
              (confirmandoExclusao ? (
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pendente}
                    onClick={() =>
                      executar(() => excluirCategoria(categoria.id))
                    }
                    className={`${BOTAO_DESTRUTIVO} py-1 text-sm`}
                  >
                    {pendente ? "Excluindo..." : "Confirmar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmandoExclusao(false)}
                    className="text-sm text-ink-muted"
                  >
                    Não
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmandoExclusao(true)}
                  className="text-sm font-medium text-warn transition-transform duration-150 active:scale-[0.97]"
                >
                  Excluir
                </button>
              ))}
          </div>
        </div>
      )}

      {(erro || estadoRenome?.erro) && (
        <p className="animate-entrada mt-2 text-sm text-warn">
          {erro || estadoRenome.erro}
        </p>
      )}
    </li>
  );
}

export default function GerenciarCategorias({ categorias }) {
  return (
    <>
      <FormularioNovaCategoria />

      <div className={`${CARTAO} animate-entrada mt-4 px-4`}>
        <ul className="stagger divide-y divide-line">
          {categorias.map((categoria) => (
            // O nome entra na key de propósito: renomear remonta a linha e
            // fecha o formulário de edição (ver comentário em LinhaCategoria).
            <LinhaCategoria
              key={`${categoria.id}-${categoria.nome}`}
              categoria={categoria}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
