// Sugestões de atributos/opções por categoria do estabelecimento — só
// pré-preenchem o nome no formulário do comerciante, que pode ignorar,
// editar ou adicionar qualquer outra coisa. Categoria sem entrada aqui
// simplesmente não sugere nada (não é uma lista fechada de tipos).
const SUGESTOES_POR_CATEGORIA = {
  Alimentação: {
    atributos: ["Ingredientes", "Tempo de preparo"],
    opcoes: ["Tamanho", "Adicionais"],
  },
  Mercado: {
    atributos: ["Marca", "Peso", "Unidade"],
    opcoes: [],
  },
  Farmácia: {
    atributos: ["Marca", "Princípio ativo", "Quantidade"],
    opcoes: [],
  },
  Loja: {
    atributos: ["Marca", "Material"],
    opcoes: ["Tamanho", "Cor"],
  },
};

export function sugestoesPara(nomeCategoria) {
  return SUGESTOES_POR_CATEGORIA[nomeCategoria] || { atributos: [], opcoes: [] };
}
