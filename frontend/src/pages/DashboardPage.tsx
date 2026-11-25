import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Logo } from "../components/Logo";

function remaining(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m} min ${String(s % 60).padStart(2, "0")} s`;
}

export function DashboardPage() {
  const { email, expiresAt, logout } = useAuth();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const initial = (email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="app">
      <header className="topbar">
        <Logo />
        <div className="topbar-right">
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span className="who">{email}</span>
          <button className="btn ghost" onClick={logout}>Se déconnecter</button>
        </div>
      </header>
      <main className="content">
        <h1>Bonjour</h1>
        <p className="muted">Vous êtes connecté à SmartCampus.</p>
        <section className="grid">
          <article className="stat">
            <span className="stat-label">Compte</span>
            <strong className="stat-value small">{email}</strong>
          </article>
          <article className="stat">
            <span className="stat-label">Session</span>
            <strong className="stat-value">{expiresAt ? remaining(expiresAt - now) : "-"}</strong>
            <span className="stat-hint">avant déconnexion automatique</span>
          </article>
          <article className="stat">
            <span className="stat-label">Sécurité</span>
            <strong className="stat-value">JWT actif</strong>
            <span className="stat-hint">jeton stocké pour cet onglet seulement</span>
          </article>
        </section>
        <section className="empty">
          <h2>Vos services arrivent bientôt</h2>
          <p className="muted">Les prochaines fonctionnalités de SmartCampus apparaîtront ici.</p>
        </section>
      </main>
    </div>
  );
}
