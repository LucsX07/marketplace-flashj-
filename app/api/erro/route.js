import { registrarErro } from "@/lib/registrar-erro";

// Erro que acontece no navegador (uma tela que quebra ao renderizar) nunca
// chegaria no servidor sozinho — ficaria só no console do celular de quem
// usou, ou seja, invisível. As telas de erro mandam o problema pra cá.
//
// Isso é uma rota pública, então qualquer um pode chamar. Por isso ela não
// grava nada no banco: só escreve uma linha de log. O pior que alguém
// consegue fazer é sujar o log — e mesmo isso é limitado pelo tamanho.
const LIMITE_DE_TEXTO = 500;

function texto(valor) {
  return typeof valor === "string" ? valor.slice(0, LIMITE_DE_TEXTO) : null;
}

export async function POST(request) {
  try {
    const corpo = await request.json();

    registrarErro(
      "navegador",
      { message: texto(corpo?.mensagem) ?? "erro sem mensagem" },
      {
        // Só estes três campos passam. Nada de aceitar o objeto inteiro que
        // veio de fora — senão dava pra empurrar qualquer coisa pro log.
        tela: texto(corpo?.tela),
        digest: texto(corpo?.digest),
        origem: "cliente",
      }
    );
  } catch {
    // Corpo inválido: não é motivo pra devolver erro pra uma tela que já
    // está quebrada. Ignora e responde ok do mesmo jeito.
  }

  return new Response(null, { status: 204 });
}
