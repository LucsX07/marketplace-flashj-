"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/server";
import { registrarErro } from "@/lib/registrar-erro";

// Quem pode mexer em categoria é o administrador, e quem garante isso é a
// policy "categorias: admin gerencia" no banco — não estas funções. Por isso
// cada uma confere quantas linhas mudaram: se a policy barrar, o Supabase
// devolve sucesso com zero linhas, e sem essa checagem a tela diria que
// salvou sem ter salvado nada.
const LIMITE_DO_NOME = 40;

function limparNome(formData) {
  return (formData.get("nome") || "").trim().replace(/\s+/g, " ");
}

function validar(nome) {
  if (nome.length < 2) return "Escreva o nome da categoria.";
  if (nome.length > LIMITE_DO_NOME)
    return `Use no máximo ${LIMITE_DO_NOME} caracteres.`;
  return null;
}

// As telas que revalidam: o formulário de cadastro e os dois de loja também
// listam categorias, então mudar uma aqui precisa aparecer lá.
function revalidarTelasComCategoria() {
  revalidatePath("/painel/admin");
  revalidatePath("/painel");
  revalidatePath("/painel/loja");
  revalidatePath("/cadastro");
}

export async function criarCategoria(estadoAnterior, formData) {
  const nome = limparNome(formData);
  const problema = validar(nome);
  if (problema) return { erro: problema };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .insert({ nome })
    .select("id");

  if (error) {
    // 23505 = nome repetido, se houver índice único; a mensagem é a mesma
    // coisa pro usuário de qualquer jeito.
    if (error.code === "23505") {
      return { erro: "Já existe uma categoria com esse nome." };
    }
    registrarErro("criarCategoria", error);
    return { erro: "Não foi possível criar a categoria." };
  }

  if (!data || data.length === 0) {
    return { erro: "Você não tem permissão para criar categorias." };
  }

  revalidarTelasComCategoria();
  return { sucesso: true };
}

export async function renomearCategoria(categoriaId, estadoAnterior, formData) {
  const nome = limparNome(formData);
  const problema = validar(nome);
  if (problema) return { erro: problema };

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .update({ nome })
    .eq("id", categoriaId)
    .select("id");

  if (error) {
    if (error.code === "23505") {
      return { erro: "Já existe uma categoria com esse nome." };
    }
    registrarErro("renomearCategoria", error, { categoriaId });
    return { erro: "Não foi possível renomear a categoria." };
  }

  if (!data || data.length === 0) {
    return { erro: "Você não tem permissão para renomear categorias." };
  }

  revalidarTelasComCategoria();
  return { sucesso: true };
}

// Desativar é o caminho normal: a categoria some das listas de quem vai
// cadastrar uma loja nova, mas quem já está nela continua onde está
// (listarCategorias filtra por ativo).
export async function alternarCategoriaAtiva(categoriaId, ativo) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .update({ ativo })
    .eq("id", categoriaId)
    .select("id");

  if (error) {
    registrarErro("alternarCategoriaAtiva", error, { categoriaId, ativo });
    return { erro: "Não foi possível alterar a categoria." };
  }

  if (!data || data.length === 0) {
    return { erro: "Você não tem permissão para alterar categorias." };
  }

  revalidarTelasComCategoria();
  return { sucesso: true };
}

// Excluir de vez só faz sentido pra categoria criada por engano. Se alguma
// loja usa, o próprio Postgres recusa (a chave estrangeira é NO ACTION e
// categoria_id é obrigatória) — deixo o banco decidir e traduzo o 23503.
export async function excluirCategoria(categoriaId) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", categoriaId)
    .select("id");

  if (error) {
    if (error.code === "23503") {
      return {
        erro:
          "Existem lojas nessa categoria, então ela não pode ser apagada. " +
          "Desative para tirá-la das opções de cadastro.",
      };
    }
    registrarErro("excluirCategoria", error, { categoriaId });
    return { erro: "Não foi possível excluir a categoria." };
  }

  if (!data || data.length === 0) {
    return { erro: "Você não tem permissão para excluir categorias." };
  }

  revalidarTelasComCategoria();
  return { sucesso: true };
}
