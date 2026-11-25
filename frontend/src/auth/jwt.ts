export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isExpired(token: string, now = Date.now()): boolean {
  const p = decodeJwt(token);
  if (!p?.exp) return true;
  return p.exp * 1000 <= now;
}
