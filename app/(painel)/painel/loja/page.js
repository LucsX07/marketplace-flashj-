import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarMeuEstabelecimento } from "@/lib/estabelecimentos";
import { listarCategorias } from "@/lib/categorias";
import {
  atualizarImagemEstabelecimento,
  removerImagemEstabelecimento,
} from "@/lib/actions/estabelecimentos";
import FormularioEstabelecimento from "../FormularioEstabelecimento";
import UploadImagem from "@/components/UploadImagem";
import AbrirFecharLoja from "./AbrirFecharLoja";

export default async function EditarLoja() {
  const estabelecimento = await buscarMeuEstabelecimento();
  if (!estabelecimento) notFound();

  const categorias = await listarCategorias();
  const enviarCapa = atualizarImagemEstabelecimento.bind(null, estabelecimento.id);
  const removerCapa = removerImagemEstabelecimento.bind(null, estabelecimento.id);

  return (
    <main className="animate-entrada mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/painel"
        className="text-sm font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
      >
        ← Painel
      </Link>
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink">
        Minha loja
      </h1>

      <div className="mt-6">
        <UploadImagem
          urlAtual={estabelecimento.capa_url}
          acaoEnviar={enviarCapa}
          acaoRemover={removerCapa}
          rotulo="Capa da loja"
        />
      </div>

      <div className="mt-6">
        <AbrirFecharLoja
          estabelecimentoId={estabelecimento.id}
          abertoAgora={estabelecimento.aberto_agora}
        />
      </div>

      <FormularioEstabelecimento categorias={categorias} estabelecimento={estabelecimento} />
    </main>
  );
}
