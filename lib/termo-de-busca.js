// Prepara o que a pessoa digitou pra entrar num filtro `.or(...)` do
// Supabase. São dois problemas diferentes empilhados, e errar qualquer um
// dos dois quebra a busca:
//
// 1. O `.or()` é uma STRING onde a vírgula separa condições. Alguém
//    procurando "caneta, azul" partiria o filtro no meio. A defesa é
//    envolver o valor em aspas duplas: aí o PostgREST lê tudo como um
//    valor só.
//
//    A aspas dupla que venha DENTRO do termo é simplesmente removida, não
//    escapada. Em tese `\"` funciona, mas eu não consigo verificar isso
//    daqui, e uma aspas mal interpretada fecharia o valor cedo e mudaria o
//    filtro. Ninguém busca catálogo de loja com aspas — jogar fora custa
//    nada e tira a dúvida.
//
// 2. Dentro do ILIKE, % e _ são curingas. Sem escapar, digitar "%%" traz o
//    catálogo inteiro (testado: 19 de 19 produtos), e "__" idem. Com a
//    barra na frente, o Postgres trata como texto comum.
//
// A ordem importa: a barra é escapada primeiro, senão as barras que este
// código mesmo adiciona seriam escapadas de novo depois.
export function padraoDeBusca(termo) {
  const limpo = (termo || "").trim();

  const escapado = limpo
    .replace(/"/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/[%_]/g, (caractere) => `\\${caractere}`);

  return `"%${escapado}%"`;
}

// Abaixo de dois caracteres, qualquer busca traz quase tudo e não ajuda
// ninguém. Melhor não consultar o banco.
export const MINIMO_DE_CARACTERES = 2;

export function termoValido(termo) {
  return (termo || "").trim().length >= MINIMO_DE_CARACTERES;
}
