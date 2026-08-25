"use client";

import { useRef, useState, useTransition } from "react";
import { comprimirImagem } from "@/lib/imagem";
import BrandMark from "@/components/BrandMark";
import { BOTAO_SECUNDARIO } from "@/lib/ui";

// Widget de upload de imagem reutilizado no painel (capa do estabelecimento
// e imagem do produto). Recebe as duas server actions já "amarradas" ao
// registro certo (ex.: `atualizarImagemProduto.bind(null, produto.id)`) —
// esse componente só cuida do arquivo/prévia/estados visuais.
export default function UploadImagem({ urlAtual, acaoEnviar, acaoRemover, rotulo = "Imagem" }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(urlAtual || null);
  const [comprimindo, setComprimindo] = useState(false);
  const [erro, setErro] = useState(null);
  const [pendente, iniciarTransicao] = useTransition();

  async function lidarComArquivo(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;

    setErro(null);
    setComprimindo(true);

    let comprimida;
    try {
      comprimida = await comprimirImagem(arquivo);
    } catch {
      setErro("Não foi possível processar essa imagem. Tenta outra foto.");
      setComprimindo(false);
      return;
    }
    setComprimindo(false);

    const urlLocal = URL.createObjectURL(comprimida);
    setPreview(urlLocal);

    const formData = new FormData();
    formData.append("imagem", comprimida);

    iniciarTransicao(async () => {
      const resultado = await acaoEnviar(formData);
      if (resultado?.erro) {
        setErro(resultado.erro);
      }
    });
  }

  function remover() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await acaoRemover();
      if (resultado?.erro) {
        setErro(resultado.erro);
      } else {
        setPreview(null);
      }
    });
  }

  const estaOcupado = comprimindo || pendente;

  return (
    <div>
      <p className="text-sm font-medium text-ink">{rotulo}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-2">
          {preview ? (
            // Prévia local (blob:) — next/image não lida bem com blob URLs,
            // e é só uma prévia transitória até o upload confirmar.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <BrandMark className="h-6 w-6 text-ink-faint" />
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={estaOcupado}
            className={`${BOTAO_SECUNDARIO} text-sm`}
          >
            {comprimindo ? "Preparando..." : pendente ? "Enviando..." : preview ? "Trocar imagem" : "Adicionar imagem"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={remover}
              disabled={estaOcupado}
              className="text-xs font-medium text-ink-faint transition-colors duration-150 hover:text-warn disabled:opacity-60"
            >
              Remover
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={lidarComArquivo}
        className="hidden"
      />
      {erro && <p className="animate-entrada mt-2 text-sm text-warn">{erro}</p>}
    </div>
  );
}
