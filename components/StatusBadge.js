import { STATUS_LABEL, STATUS_BADGE, STATUS_DOT } from "@/lib/status-pedido";

export default function StatusBadge({ status, pulsar = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[status]} ${pulsar ? "animate-pulso-status" : ""} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
