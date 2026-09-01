// Variants reaproveitados nas telas que usam Framer Motion — mesmo timing
// que a animação CSS antiga (.animate-entrada), só que via JS pra permitir
// coisas que CSS puro não faz bem (saída de item de lista, transição
// entre páginas). `reducedMotion="user"` no MotionConfig do layout já
// cuida de "prefers-reduced-motion" pra tudo que usa esses variants.

export const ITEM_ENTRADA = {
  oculto: { opacity: 0, y: 6 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  saida: { opacity: 0, transition: { duration: 0.15 } },
};

export const LISTA_ENTRADA = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.05 } },
};

export const TOQUE_BOTAO = { scale: 0.96 };
export const TOQUE_CARTAO = { scale: 0.99, y: -1 };
