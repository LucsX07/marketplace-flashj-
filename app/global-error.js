"use client";

// Cobre erros que acontecem no próprio layout raiz (ex.: Supabase não
// configurado ainda) — app/error.js sozinho não alcança esse caso. Como
// isso substitui todo o <html>/<body>, o CSS do app não é carregado aqui,
// então o estilo (incluindo modo escuro) vem embutido neste componente.
export default function ErroGlobalRaiz({ error, reset }) {
  const naoConfigurado = error?.message?.includes("Supabase não configurado");

  return (
    <html lang="pt-BR">
      <head>
        <style>{`
          :root { --bg:#faf9f6; --ink:#101312; --muted:#5b615c; --brand:#009b48; --on-brand:#fff; }
          @media (prefers-color-scheme: dark) {
            :root { --bg:#101312; --ink:#f3f4f1; --muted:#9ba39d; --brand:#16b85c; --on-brand:#06170e; }
          }
          body { margin:0; background:var(--bg); color:var(--ink); font-family: ui-sans-serif, system-ui, sans-serif; }
        `}</style>
      </head>
      <body>
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "64px 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>
            {naoConfigurado ? "Falta configurar o Supabase" : "Algo deu errado"}
          </h1>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>
            {naoConfigurado
              ? "Crie um projeto em supabase.com, copie a URL e a anon key em Project Settings > API, e cole no arquivo .env.local (veja o README)."
              : error?.message || "Tente novamente em instantes."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              borderRadius: 4,
              background: "var(--brand)",
              color: "var(--on-brand)",
              border: "none",
              fontWeight: 600,
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
