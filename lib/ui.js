// Classes Tailwind reutilizáveis pros elementos interativos do app — mantém
// o mesmo toque (feedback ao clique, transições) em todo lugar sem repetir
// a mesma string em cada arquivo.

export const BOTAO_PRIMARIO =
  "corner-cut rounded-sm bg-brand px-4 py-2 font-semibold text-on-brand transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

export const BOTAO_SECUNDARIO =
  "rounded-md border border-line px-4 py-2 font-medium text-ink transition-[border-color,transform] duration-150 ease-out hover:border-line-strong active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

// Confirmação de ação que não dá pra desfazer (excluir produto, desativar
// loja). Usa --on-warn e não branco puro: no tema escuro o vermelho fica
// mais claro, e branco em cima dele não alcança contraste legível.
export const BOTAO_DESTRUTIVO =
  "rounded-md bg-warn px-4 py-2 font-semibold text-on-warn transition-transform duration-150 ease-out active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

export const LINK_MARCA =
  "font-medium text-brand transition-colors duration-150 hover:text-brand-hover";

export const CAMPO =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

// Elevação se declara UMA vez. Antes o cartão tinha borda e sombra ao mesmo
// tempo — uma linha de 1px por baixo de uma sombra larga — e isso lê como
// card fantasma, não como profundidade.
//
// O sistema agora é: superfície + sombra, sem borda. No claro quem separa é
// a sombra; no escuro, onde sombra preta some, quem separa é o degrau entre
// --surface e --bg. Borda ficou reservada pro CARTAO_PLANO, que é o oposto:
// delimita sem levantar.
//
// Raio de 12px (era 6). O piso pede 12–16 pra card; abaixo disso a peça lê
// como caixa de formulário, não como objeto.
export const CARTAO =
  "rounded-xl bg-surface shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-150 ease-out";

// Contêiner que agrupa sem pretender flutuar: formulário, bloco de dados,
// aviso. Borda, nenhuma sombra.
export const CARTAO_PLANO = "rounded-xl border border-line bg-surface";

// Card que é link ou botão: levanta no hover, afunda no toque.
export const CARTAO_INTERATIVO =
  "rounded-xl bg-surface shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]";

// Bloco de grafite: o peso que ancora a página e o que ocupa o lugar de uma
// foto que ainda não existe. Ver o comentário do --graphite em globals.css.
export const BLOCO_GRAFITE = "bg-graphite text-on-graphite";

export const ENTRADA = "animate-entrada";
