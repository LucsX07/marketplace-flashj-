"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Troca de página com um crossfade curto em vez do corte seco padrão do
// navegador — a página antiga sai, a nova entra por cima. `initial={false}`
// evita animar a primeira carga (já cuidada pelas animações de entrada de
// cada tela).
export default function TransicaoDePagina({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
