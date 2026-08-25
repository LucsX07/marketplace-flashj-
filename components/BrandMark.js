export default function BrandMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <polygon points="3,2 11,2 8,22 0,22" />
      <polygon points="14,7 20,7 17,22 11,22" />
    </svg>
  );
}
