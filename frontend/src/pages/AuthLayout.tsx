import type { ReactNode } from "react";
import { Logo } from "../components/Logo";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="auth-shell">
      <aside className="auth-hero">
        <Logo light />
        <div>
          <h2>Votre campus, connecté.</h2>
          <p>Un seul espace sécurisé pour accéder à vos services universitaires.</p>
          <ul>
            <li>Authentification sécurisée par jeton JWT</li>
            <li>Verrouillage automatique après 3 échecs</li>
            <li>Session fermée à l'expiration du jeton</li>
          </ul>
        </div>
        <small>© SmartCampus</small>
      </aside>
      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
