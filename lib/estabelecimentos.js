// Dados de exemplo (mock) até conectarmos o Supabase.
export const estabelecimentos = [
  {
    id: "1",
    nome: "Padaria do Zé",
    categoria: "Alimentação",
    descricao: "Pães, salgados e doces fresquinhos.",
    endereco: "Rua das Flores, 123",
  },
  {
    id: "2",
    nome: "Lanchonete da Praça",
    categoria: "Alimentação",
    descricao: "Lanches, sucos e porções.",
    endereco: "Av. Central, 456",
  },
  {
    id: "3",
    nome: "Mercadinho Bom Preço",
    categoria: "Mercado",
    descricao: "Produtos do dia a dia.",
    endereco: "Rua Nova, 789",
  },
];

export function buscarEstabelecimentoPorId(id) {
  return estabelecimentos.find((estabelecimento) => estabelecimento.id === id);
}
