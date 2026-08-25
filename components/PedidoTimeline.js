import { STATUS_PEDIDO, STATUS_LABEL, STATUS_SEQUENCIA } from "@/lib/status-pedido";

export default function PedidoTimeline({ status }) {
  const foiRecusado = status === STATUS_PEDIDO.RECUSADO;
  const passos = foiRecusado ? [STATUS_PEDIDO.PENDENTE, STATUS_PEDIDO.RECUSADO] : STATUS_SEQUENCIA;
  const indiceAtual = passos.indexOf(status);

  return (
    <ol>
      {passos.map((passo, indice) => {
        const concluido = indice < indiceAtual;
        const atual = indice === indiceAtual;
        const futuro = indice > indiceAtual;
        const ehRecusado = passo === STATUS_PEDIDO.RECUSADO;

        return (
          <li key={passo} className="relative flex gap-3 pb-6 last:pb-0">
            {indice < passos.length - 1 && (
              <span
                className={`absolute left-[5px] top-4 h-full w-px transition-colors duration-300 ${
                  concluido || (atual && foiRecusado) ? "bg-warn" : concluido ? "bg-brand" : "bg-line"
                }`}
              />
            )}
            <span
              className={`relative z-10 mt-0.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 transition-colors duration-300 ${
                ehRecusado && atual
                  ? "border-warn bg-warn"
                  : concluido || atual
                    ? "border-brand bg-brand"
                    : "border-line bg-surface"
              } ${atual ? "animate-pulso-status" : ""}`}
            />
            <span
              className={`text-sm ${
                atual ? "font-semibold text-ink" : futuro ? "text-ink-faint" : "text-ink-muted"
              }`}
            >
              {STATUS_LABEL[passo]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
