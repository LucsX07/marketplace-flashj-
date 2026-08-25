"use client";

import { useEffect, useState } from "react";

const CHAVE = "flashja-tema";
const OPCOES = [
  { valor: "sistema", rotulo: "Sistema" },
  { valor: "light", rotulo: "Claro" },
  { valor: "dark", rotulo: "Escuro" },
];

export default function SeletorDeTema() {
  const [tema, setTema] = useState("sistema");

  // Só lê localStorage depois de montar (evita divergir do HTML gerado no
  // servidor, que não sabe a preferência salva no navegador). setState fica
  // num microtask pra não disparar sincronamente dentro do efeito.
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE);
    queueMicrotask(() => {
      setTema(salvo === "light" || salvo === "dark" ? salvo : "sistema");
    });
  }, []);

  function escolher(novoTema) {
    setTema(novoTema);
    if (novoTema === "sistema") {
      localStorage.removeItem(CHAVE);
      document.documentElement.removeAttribute("data-theme");
    } else {
      localStorage.setItem(CHAVE, novoTema);
      document.documentElement.setAttribute("data-theme", novoTema);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink">Tema</p>
      <div className="mt-2 flex gap-2">
        {OPCOES.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => escolher(opcao.valor)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
              tema === opcao.valor
                ? "border-brand bg-brand-tint text-brand"
                : "border-line text-ink-muted hover:border-line-strong"
            }`}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}
