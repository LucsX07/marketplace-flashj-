// Armazenamento provisório dos pedidos no navegador (localStorage), só para
// simular o fluxo completo antes de termos um banco de dados real (Supabase).
// Sem entregador no MVP: o pedido é sempre para retirada no estabelecimento.

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

const CHAVE_STORAGE = "flashja_pedidos";

function lerPedidos() {
  if (typeof window === "undefined") return [];
  const dados = window.localStorage.getItem(CHAVE_STORAGE);
  return dados ? JSON.parse(dados) : [];
}

function salvarPedidos(pedidos) {
  window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedidos));
}

export function listarPedidos() {
  return lerPedidos();
}

export function buscarPedidoPorId(id) {
  return lerPedidos().find((pedido) => pedido.id === id);
}

export function criarPedido({ estabelecimentoId, itens, total, cliente }) {
  const pedidos = lerPedidos();
  const pedido = {
    id: crypto.randomUUID(),
    estabelecimentoId,
    itens,
    total,
    cliente,
    status: STATUS_PEDIDO.PENDENTE,
    criadoEm: new Date().toISOString(),
  };
  salvarPedidos([...pedidos, pedido]);
  return pedido;
}

export function atualizarStatusPedido(id, status) {
  const pedidos = lerPedidos().map((pedido) =>
    pedido.id === id ? { ...pedido, status } : pedido
  );
  salvarPedidos(pedidos);
}
