// Constantes puras — sem dependência de servidor, podem ser
// importadas tanto por Server Components quanto por Client Components.
export const STATUS_PEDIDO = {
  PENDENTE: "pendente",
  ACEITO: "aceito",
  RECUSADO: "recusado",
  EM_PREPARO: "em_preparo",
  PRONTO: "pronto",
  CONCLUIDO: "concluido",
};

export const STATUS_LABEL = {
  [STATUS_PEDIDO.PENDENTE]: "Pendente",
  [STATUS_PEDIDO.ACEITO]: "Aceito",
  [STATUS_PEDIDO.RECUSADO]: "Recusado",
  [STATUS_PEDIDO.EM_PREPARO]: "Em preparo",
  [STATUS_PEDIDO.PRONTO]: "Pronto para retirada",
  [STATUS_PEDIDO.CONCLUIDO]: "Concluído",
};

// Classes Tailwind (badge fundo + texto) por status — verde para o que avança,
// cinza para quem espera, vermelho só para recusado.
export const STATUS_BADGE = {
  [STATUS_PEDIDO.PENDENTE]: "bg-surface-2 text-ink-muted",
  [STATUS_PEDIDO.ACEITO]: "bg-brand-tint text-brand-hover",
  [STATUS_PEDIDO.EM_PREPARO]: "bg-brand-tint text-brand-hover",
  [STATUS_PEDIDO.PRONTO]: "bg-brand text-on-brand",
  [STATUS_PEDIDO.CONCLUIDO]: "bg-brand text-on-brand",
  [STATUS_PEDIDO.RECUSADO]: "bg-warn-tint text-warn",
};
