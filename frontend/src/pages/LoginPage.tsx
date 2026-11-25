import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { validateEmail, validatePassword } from "../auth/validation";
import { Field } from "../components/Field";
import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const registered = (loc.state as { registered?: boolean; from?: string } | null)?.registered;
  const from = (loc.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = { email: validateEmail(email), password: validatePassword(password, false) };
    setErrors(errs);
    setFormError(null);
    if (errs.email || errs.password) return;
    setBusy(true);
    try {
      await login(email.trim(), password);
      nav(from, { replace: true });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Connexion" subtitle="Heureux de vous revoir. Entrez vos identifiants.">
      {registered && <div className="alert ok" role="status">Compte créé. Vous pouvez vous connecter.</div>}
      {formError && <div className="alert err" role="alert">{formError}</div>}
      <form onSubmit={onSubmit} noValidate>
        <Field label="Adresse courriel" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field label="Mot de passe" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
      </form>
      <p className="switch">Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
    </AuthLayout>
  );
}
