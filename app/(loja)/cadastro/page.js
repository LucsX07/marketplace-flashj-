import { listarCategorias } from "@/lib/categorias";
import FormularioCadastro from "./FormularioCadastro";

export default async function PaginaCadastro({ searchParams }) {
  const parametros = await searchParams;
  const tipoInicial = parametros?.tipo === "comerciante" ? "comerciante" : "consumidor";
  const categorias = await listarCategorias();

  return <FormularioCadastro categorias={categorias} tipoInicial={tipoInicial} />;
}
