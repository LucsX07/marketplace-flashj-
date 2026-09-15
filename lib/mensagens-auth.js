// Traduz o erro do Supabase Auth pra uma frase em português que diz o que
// fazer. Antes isso ia cru pra tela: "Password should be at least 6
// characters" em inglês, técnico, pra um usuário que só queria se cadastrar.
//
// A ordem é: primeiro o `code` (estável, é o que o Supabase promete manter),
// depois um reconhecimento pela mensagem em inglês (versões mais antigas do
// SDK não mandam code em tudo), e no fim uma frase genérica. O texto em
// inglês nunca chega ao usuário — se não soubermos traduzir, é melhor uma
// frase honesta e vaga do que jargão.

const POR_CODIGO = {
  user_already_exists: "Já existe uma conta com esse e-mail. Tente entrar.",
  email_exists: "Já existe uma conta com esse e-mail. Tente entrar.",
  weak_password:
    "Essa senha é fácil de adivinhar. Escolha uma com pelo menos 6 caracteres, misturando letras e números.",
  over_email_send_rate_limit:
    "Muitos e-mails enviados em pouco tempo. Espere alguns minutos e tente de novo.",
  over_request_rate_limit: "Muitas tentativas seguidas. Espere um minuto e tente de novo.",
  email_address_invalid: "Esse e-mail não parece válido. Confira se está escrito certo.",
  validation_failed: "Confira os dados preenchidos e tente de novo.",
  same_password: "A senha nova precisa ser diferente da antiga.",
  session_expired: "Sua sessão expirou. Entre de novo.",
};

// Cada item é [trecho da mensagem em inglês, tradução].
const POR_MENSAGEM = [
  ["already registered", POR_CODIGO.user_already_exists],
  ["already been registered", POR_CODIGO.user_already_exists],
  ["at least 6 characters", "A senha precisa ter pelo menos 6 caracteres."],
  ["password should be", "A senha precisa ter pelo menos 6 caracteres."],
  ["known to be weak", POR_CODIGO.weak_password],
  ["invalid format", POR_CODIGO.email_address_invalid],
  ["unable to validate email", POR_CODIGO.email_address_invalid],
  ["rate limit", POR_CODIGO.over_email_send_rate_limit],
  ["for security purposes", "Espere alguns segundos antes de tentar de novo."],
  ["new password should be different", POR_CODIGO.same_password],
];

export function mensagemDeAuth(erro, alternativa) {
  const doCodigo = POR_CODIGO[erro?.code];
  if (doCodigo) return doCodigo;

  const mensagem = (erro?.message || "").toLowerCase();
  const encontrada = POR_MENSAGEM.find(([trecho]) => mensagem.includes(trecho));
  if (encontrada) return encontrada[1];

  return alternativa;
}
