import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { AppShell } from "../components/AppShell";
import { displayName, formatRemaining } from "../auth/session";

export function DashboardPage() {
  const { email, expiresAt } = useAuth();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <AppShell>
      <main className="content">
        <h1>Bonjour, {displayName(email)}</h1>
        <p className="muted">Vous êtes connecté à SmartCampus.</p>
        <section className="grid">
          <article className="stat">
            <span className="stat-label">Compte</span>
            <strong className="stat-value small">{email}</strong>
          </article>
          <article className="stat">
            <span className="stat-label">Session</span>
            <strong className="stat-value">{expiresAt ? formatRemaining(expiresAt - now) : "-"}</strong>
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
    </AppShell>
  );
}
