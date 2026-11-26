import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { formatRemaining } from "../auth/session";

export const WARN_MS = 5 * 60 * 1000;

export function SessionBanner() {
  const { expiresAt, logout } = useAuth();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (!expiresAt) return null;
  const left = expiresAt - now;
  if (left > WARN_MS) return null;
  return (
    <div className="session-banner" role="status">
      <span>Votre session expire dans <strong>{formatRemaining(left)}</strong>. Enregistrez votre travail.</span>
      <button className="btn ghost" onClick={logout}>Se reconnecter</button>
    </div>
  );
}
