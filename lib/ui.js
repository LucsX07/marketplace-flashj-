// Classes Tailwind reutilizáveis pros elementos interativos do app — mantém
// o mesmo toque (feedback ao clique, transições) em todo lugar sem repetir
// a mesma string em cada arquivo.

export const BOTAO_PRIMARIO =
  "corner-cut rounded-sm bg-brand px-4 py-2 font-semibold text-on-brand transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

export const BOTAO_SECUNDARIO =
  "rounded-md border border-line px-4 py-2 font-medium text-ink transition-[border-color,transform] duration-150 ease-out hover:border-line-strong active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100";

export const LINK_MARCA =
  "font-medium text-brand transition-colors duration-150 hover:text-brand-hover";

export const CAMPO =
  "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export const CARTAO =
  "rounded-md border border-line bg-surface transition-[border-color,transform] duration-150 ease-out";

export const ENTRADA = "animate-entrada";
