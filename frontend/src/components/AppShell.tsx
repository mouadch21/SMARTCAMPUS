import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Logo } from "./Logo";
import { SessionBanner } from "./SessionBanner";

export function AppShell({ children }: { children: ReactNode }) {
  const { email, logout } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const initial = (email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <Logo />
          <nav className="nav" aria-label="Navigation principale">
            <NavLink to="/" end>Accueil</NavLink>
            <NavLink to="/profil">Profil</NavLink>
          </nav>
        </div>
        <div className="topbar-right">
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span className="who">{email}</span>
          {confirming ? (
            <span className="confirm" role="alertdialog" aria-label="Confirmer la déconnexion">
              <button className="btn danger" onClick={logout}>Confirmer</button>
              <button className="btn ghost" onClick={() => setConfirming(false)}>Annuler</button>
            </span>
          ) : (
            <button className="btn ghost" onClick={() => setConfirming(true)}>Se déconnecter</button>
          )}
        </div>
      </header>
      <SessionBanner />
      {children}
    </div>
  );
}
