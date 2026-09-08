// Manda pro servidor um erro que quebrou uma tela no navegador. Usado pelas
// telas de erro (app/error.js e companhia) — ver app/api/erro/route.js.
//
// keepalive: o envio sobrevive se a pessoa fechar ou recarregar a página
// logo depois de ver o erro, que é justamente o que costuma acontecer.
export function avisarErroDoNavegador(tela, erro) {
  try {
    fetch("/api/erro", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tela,
        mensagem: erro?.message,
        digest: erro?.digest,
      }),
    }).catch(() => {});
  } catch {
    // Se nem avisar do erro deu certo, não adianta insistir.
  }
}
