// Dados de exemplo (mock) só para o projeto rodar antes de conectarmos um banco de dados real.
export const produtos = [
  {
    id: "1",
    nome: "Camiseta Básica",
    preco: 59.9,
    descricao: "Camiseta 100% algodão, confortável para o dia a dia.",
  },
  {
    id: "2",
    nome: "Caneca de Cerâmica",
    preco: 34.5,
    descricao: "Caneca 300ml, ideal para café ou chá.",
  },
  {
    id: "3",
    nome: "Mochila Casual",
    preco: 149.9,
    descricao: "Mochila resistente com compartimento para notebook.",
  },
];

export function buscarProdutoPorId(id) {
  return produtos.find((produto) => produto.id === id);
}
