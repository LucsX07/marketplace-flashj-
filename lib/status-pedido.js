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

// Cor só da bolinha indicadora (usada ao lado do badge, no card resumido).
export const STATUS_DOT = {
  [STATUS_PEDIDO.PENDENTE]: "bg-ink-faint",
  [STATUS_PEDIDO.ACEITO]: "bg-brand",
  [STATUS_PEDIDO.EM_PREPARO]: "bg-brand",
  [STATUS_PEDIDO.PRONTO]: "bg-brand",
  [STATUS_PEDIDO.CONCLUIDO]: "bg-brand",
  [STATUS_PEDIDO.RECUSADO]: "bg-warn",
};

// Caminho "feliz" do pedido, usado pra desenhar a timeline (stepper).
// Recusado é um desvio a partir de pendente, tratado à parte pelo componente.
export const STATUS_SEQUENCIA = [
  STATUS_PEDIDO.PENDENTE,
  STATUS_PEDIDO.ACEITO,
  STATUS_PEDIDO.EM_PREPARO,
  STATUS_PEDIDO.PRONTO,
  STATUS_PEDIDO.CONCLUIDO,
];

export const STATUS_PAGAMENTO_LABEL = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  recusado: "Recusado",
  estornado: "Estornado",
};

export const METODO_PAGAMENTO_LABEL = {
  retirada: "Na retirada",
  stripe: "Cartão online",
};
