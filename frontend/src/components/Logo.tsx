export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo${light ? " light" : ""}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill="currentColor" opacity=".18" />
        <path d="M14 6 4 11l10 5 8-4v6h2v-7L14 6Zm-6 9.5V19c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.5l-6 3-6-3Z" fill="currentColor" />
      </svg>
      <span>SmartCampus</span>
    </div>
  );
}
