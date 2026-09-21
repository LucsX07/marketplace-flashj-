import Image from "next/image";

// Primeira letra do nome, pra usar como marca quando não há foto. Ignora
// artigo solto no começo ("O Boticário" vira B, não O) e cai numa letra
// neutra se o nome vier vazio.
const ARTIGOS = new Set(["o", "a", "os", "as", "um", "uma", "de", "da", "do"]);

function inicialDe(nome) {
  const palavras = (nome || "").trim().split(/\s+/).filter(Boolean);
  const primeira = palavras.find((p) => !ARTIGOS.has(p.toLowerCase())) || palavras[0];
  const letra = (primeira || "").match(/\p{L}|\p{N}/u);
  return letra ? letra[0].toUpperCase() : "•";
}

// Mostra a foto quando existe. Quando não existe, o espaço NÃO vira uma
// caixa cinza vazia: vira um bloco de grafite com a inicial do nome em tipo
// grande.
//
// A diferença importa mais do que parece. Um catálogo sem foto era a maior
// causa da sensação de "inacabado" — tela após tela de retângulo cinza
// idêntico. A inicial muda a cada loja e a cada produto, então a grade ganha
// ritmo, e a ausência de foto lê como escolha em vez de buraco.
//
// `className` deve trazer as dimensões (h-*/w-*/aspect-*).
export default function ImagemComPlaceholder({ src, alt, nome, className = "", sizes }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-graphite ${className}`}
        aria-hidden="true"
      >
        <span className="font-display select-none text-4xl font-extrabold tracking-tight text-on-graphite-muted/45">
          {inicialDe(nome || alt)}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 640px) 50vw, 300px"}
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
}
