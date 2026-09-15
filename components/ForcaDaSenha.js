"use client";

import { useId, useState } from "react";

// Avaliação de senha proposital simples: a checagem séria (senha que já
// vazou em outros sites) é do Supabase, no servidor. Aqui é só orientação
// enquanto a pessoa digita, pra ela não descobrir só depois de enviar que a
// senha não serve. Nunca impede o envio — o minLength do input é quem faz
// a regra valer.
function avaliar(senha) {
  if (!senha) return null;
  if (senha.length < 6) {
    return {
      nivel: 0,
      texto: "Curta demais — precisa de pelo menos 6 caracteres.",
    };
  }

  const variedade = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((tipo) =>
    tipo.test(senha),
  ).length;

  if (senha.length >= 12 && variedade >= 3) {
    return { nivel: 3, texto: "Senha forte." };
  }
  if (senha.length >= 8 && variedade >= 2) {
    return {
      nivel: 2,
      texto: "Senha razoável. Ficaria melhor um pouco mais longa.",
    };
  }
  return {
    nivel: 1,
    texto: "Senha fraca — misture letras e números, ou use mais caracteres.",
  };
}

const CORES = ["bg-warn", "bg-warn", "bg-brand/50", "bg-brand"];

export default function ForcaDaSenha({
  nome = "senha",
  rotulo = "Senha",
  className,
}) {
  const [senha, setSenha] = useState("");
  const id = useId();
  const avaliacao = avaliar(senha);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {rotulo}
      </label>
      <input
        id={id}
        type="password"
        name={nome}
        required
        minLength={6}
        autoComplete="new-password"
        value={senha}
        onChange={(evento) => setSenha(evento.target.value)}
        aria-describedby={avaliacao ? `${id}-forca` : undefined}
        className={className}
      />

      {avaliacao && (
        <div className="mt-1.5">
          <div className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((barra) => (
              <span
                key={barra}
                className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                  barra < avaliacao.nivel ? CORES[avaliacao.nivel] : "bg-line"
                }`}
              />
            ))}
          </div>
          <p
            id={`${id}-forca`}
            role="status"
            className="mt-1 text-xs text-ink-muted"
          >
            {avaliacao.texto}
          </p>
        </div>
      )}
    </div>
  );
}
