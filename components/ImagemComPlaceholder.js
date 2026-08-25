import Image from "next/image";
import BrandMark from "@/components/BrandMark";

// Mostra a imagem quando existe; quando não existe, mostra a marca da
// FlashJá num fundo neutro em vez de deixar um vazio quebrado no layout.
// `className` deve trazer as dimensões (h-*/w-*/aspect-*).
export default function ImagemComPlaceholder({ src, alt, className = "", sizes }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-2 ${className}`}>
        <BrandMark className="h-6 w-6 text-ink-faint" />
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
