// Redimensiona/recomprime uma imagem no navegador antes do upload — sem
// biblioteca, só canvas nativo. Evita que uma foto de celular (às vezes
// vários MB) trave o envio ou estoure o Storage à toa.
export async function comprimirImagem(arquivo, larguraMaxima = 1600, qualidade = 0.82) {
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, larguraMaxima / bitmap.width);
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const contexto = canvas.getContext("2d");
  contexto.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", qualidade));
  if (!blob) {
    throw new Error("Não foi possível processar a imagem.");
  }
  return new File([blob], "imagem.jpg", { type: "image/jpeg" });
}
