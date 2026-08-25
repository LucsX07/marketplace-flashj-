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
