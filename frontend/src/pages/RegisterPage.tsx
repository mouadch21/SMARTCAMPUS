import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api/client";
import { ApiError } from "../api/client";
import { passwordStrength, validateEmail, validatePassword } from "../auth/validation";
import { Field } from "../components/Field";
import { AuthLayout } from "./AuthLayout";

const LABELS = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"];

export function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null; confirm?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const strength = passwordStrength(password);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = {
      email: validateEmail(email),
      password: validatePassword(password, true),
      confirm: confirm !== password ? "Les mots de passe ne correspondent pas." : null,
    };
    setErrors(errs);
    setFormError(null);
    if (errs.email || errs.password || errs.confirm) return;
    setBusy(true);
    try {
      await api.register(email.trim(), password);
      nav("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Quelques secondes suffisent pour commencer.">
      {formError && <div className="alert err" role="alert">{formError}</div>}
      <form onSubmit={onSubmit} noValidate>
        <Field label="Adresse courriel" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field label="Mot de passe" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        {password && (
          <div className="strength" aria-live="polite">
            <div className={`bar s${strength}`}><span /><span /><span /><span /></div>
            <small>{LABELS[strength]}</small>
          </div>
        )}
        <Field label="Confirmer le mot de passe" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "Création…" : "Créer mon compte"}</button>
      </form>
      <p className="switch">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </AuthLayout>
  );
}
