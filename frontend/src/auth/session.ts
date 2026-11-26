export function formatRemaining(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m} min ${String(s % 60).padStart(2, "0")} s`;
}

export function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
}

export function displayName(email: string | null): string {
  if (!email) return "Utilisateur";
  const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return local.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) || "Utilisateur";
}
