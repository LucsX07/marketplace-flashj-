// Dados de exemplo (mock) até conectarmos o Supabase.
// Cada produto pertence a um estabelecimento (estabelecimentoId).
export const produtos = [
  { id: "1", estabelecimentoId: "1", nome: "Pão Francês (kg)", preco: 14.9, descricao: "Pão fresquinho assado na hora." },
  { id: "2", estabelecimentoId: "1", nome: "Sonho de Creme", preco: 6.5, descricao: "Doce recheado com creme." },
  { id: "3", estabelecimentoId: "2", nome: "X-Salada", preco: 18.0, descricao: "Hambúrguer, queijo, alface e tomate." },
  { id: "4", estabelecimentoId: "2", nome: "Suco Natural (500ml)", preco: 9.0, descricao: "Suco de fruta na hora." },
  { id: "5", estabelecimentoId: "3", nome: "Arroz (5kg)", preco: 24.9, descricao: "Arroz tipo 1." },
];

export function buscarProdutoPorId(id) {
  return produtos.find((produto) => produto.id === id);
}

export function buscarProdutosPorEstabelecimento(estabelecimentoId) {
  return produtos.filter((produto) => produto.estabelecimentoId === estabelecimentoId);
}
