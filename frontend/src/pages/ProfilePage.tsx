import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { decodeJwt } from "../auth/jwt";
import { displayName, formatDateTime, formatRemaining } from "../auth/session";
import { AppShell } from "../components/AppShell";

export function ProfilePage() {
  const { token, email, expiresAt, logout } = useAuth();
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const iat = token ? decodeJwt(token)?.iat : undefined;
  const name = displayName(email);

  async function copyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* presse-papiers indisponible */ }
  }

  return (
    <AppShell>
      <main className="content">
        <section className="profile-head">
          <span className="avatar big" aria-hidden="true">{name.charAt(0)}</span>
          <div>
            <h1>{name}</h1>
            <p className="muted">{email}</p>
          </div>
        </section>

        <section className="panel" aria-labelledby="p-account">
          <h2 id="p-account">Compte</h2>
          <dl className="kv">
            <dt>Adresse courriel</dt>
            <dd>{email} <button className="link" onClick={copyEmail}>{copied ? "Copié" : "Copier"}</button></dd>
            <dt>Authentification</dt>
            <dd>Jeton JWT (Bearer)</dd>
          </dl>
        </section>

        <section className="panel" aria-labelledby="p-session">
          <h2 id="p-session">Session</h2>
          <dl className="kv">
            <dt>Connexion</dt>
            <dd>{iat ? formatDateTime(iat * 1000) : "-"}</dd>
            <dt>Expiration</dt>
            <dd>{expiresAt ? formatDateTime(expiresAt) : "-"}</dd>
            <dt>Temps restant</dt>
            <dd>{expiresAt ? formatRemaining(expiresAt - now) : "-"}</dd>
          </dl>
          <p className="muted small">Le jeton reste dans cet onglet uniquement et disparaît à la fermeture.</p>
          <button className="btn ghost" onClick={logout}>Fermer la session</button>
        </section>
      </main>
    </AppShell>
  );
}
