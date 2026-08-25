"use client";

// Cobre erros que acontecem no próprio layout raiz (ex.: Supabase não
// configurado ainda) — app/error.js sozinho não alcança esse caso.
export default function ErroGlobalRaiz({ error, reset }) {
  const naoConfigurado = error?.message?.includes("Supabase não configurado");

  return (
    <html lang="pt-BR">
      <body>
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "64px 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>
            {naoConfigurado ? "Falta configurar o Supabase" : "Algo deu errado"}
          </h1>
          <p style={{ marginTop: 16, color: "#555" }}>
            {naoConfigurado
              ? "Crie um projeto em supabase.com, copie a URL e a anon key em Project Settings > API, e cole no arquivo .env.local (veja o README)."
              : error?.message || "Tente novamente em instantes."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              borderRadius: 6,
              background: "#000",
              color: "#fff",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
}
