import { useId, useState, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export function Field({ label, error, type, ...rest }: Props) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const isPwd = type === "password";
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          type={isPwd && shown ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          {...rest}
        />
        {isPwd && (
          <button type="button" className="eye" onClick={() => setShown((s) => !s)} aria-label={shown ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            {shown ? "Masquer" : "Afficher"}
          </button>
        )}
      </div>
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}
