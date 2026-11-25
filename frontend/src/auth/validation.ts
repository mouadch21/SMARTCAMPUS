const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(v: string): string | null {
  if (!v.trim()) return "L'adresse courriel est requise.";
  if (!EMAIL.test(v.trim())) return "Adresse courriel invalide.";
  return null;
}

export function validatePassword(v: string, strict: boolean): string | null {
  if (!v) return "Le mot de passe est requis.";
  if (strict && v.length < 8) return "8 caractères minimum.";
  return null;
}

export function passwordStrength(v: string): 0 | 1 | 2 | 3 | 4 {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s as 0 | 1 | 2 | 3 | 4;
}
