"use client";

export default function ErroGlobal({ error, reset }) {
  const naoConfigurado = error?.message?.includes("Supabase não configurado");

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">
        {naoConfigurado ? "Falta configurar o Supabase" : "Algo deu errado"}
      </h1>
      <p className="mt-4 text-black/60">
        {naoConfigurado
          ? "Crie um projeto em supabase.com, copie a URL e a anon key em Project Settings > API, e cole no arquivo .env.local (veja o README)."
          : error?.message || "Tente novamente em instantes."}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-black px-4 py-2 text-white hover:bg-black/80"
      >
        Tentar de novo
      </button>
    </main>
  );
}
