// Registro central de erro.
//
// Antes disso, cada action engolia o erro do Supabase e devolvia só a
// mensagem amigável — a causa real (código, detalhe) sumia, e um problema
// em produção era invisível. Aqui a mensagem amigável continua indo pro
// usuário, mas a causa vira uma linha de log estruturada.
//
// Em produção (Vercel) essas linhas aparecem em Runtime Logs e dá pra
// buscar por "FLASHJA_ERRO" ou pelo nome do lugar (ex.: "criarProduto").
// Se um dia entrar um Sentry, é aqui — e só aqui — que ele é plugado.

const MARCADOR = "FLASHJA_ERRO";

// Só id e coisas curtas entram no contexto. Nada de e-mail, senha, telefone
// ou endereço: log é lido por gente e fica guardado, então não é lugar de
// dado pessoal.
export function registrarErro(onde, erro, contexto = {}) {
  // O contexto vem primeiro de propósito: assim os campos fixos sempre
  // vencem, e nada que chegue de fora consegue falsificar o marcador ou o
  // "onde" (a rota /api/erro recebe dado de qualquer um).
  const linha = {
    ...contexto,
    marcador: MARCADOR,
    onde,
    quando: new Date().toISOString(),
    mensagem: erro?.message ?? String(erro ?? "erro sem mensagem"),
    // O Supabase devolve code/details/hint; um Error comum não tem nada disso.
    codigo: erro?.code ?? null,
    detalhe: erro?.details ?? null,
    dica: erro?.hint ?? null,
  };

  // Uma linha só, em JSON: fica legível no terminal e pesquisável no Vercel.
  console.error(JSON.stringify(linha));
}
