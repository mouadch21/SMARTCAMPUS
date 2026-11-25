import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { AuthProvider } from "../auth/AuthContext";
import { isExpired } from "../auth/jwt";
import { passwordStrength, validateEmail } from "../auth/validation";

function jwt(exp: number, sub = "a@b.ma") {
  const b = (o: object) => btoa(JSON.stringify(o)).replace(/=/g, "");
  return `${b({ alg: "HS256" })}.${b({ sub, exp })}.sig`;
}

function mount(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider><App /></AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("utils", () => {
  it("valide les courriels", () => {
    expect(validateEmail("")).toBeTruthy();
    expect(validateEmail("abc")).toBeTruthy();
    expect(validateEmail("a@b.ma")).toBeNull();
  });
  it("évalue la force du mot de passe", () => {
    expect(passwordStrength("abc")).toBe(0);
    expect(passwordStrength("Abcdef12!")).toBe(4);
  });
  it("détecte un jeton expiré", () => {
    expect(isExpired(jwt(1))).toBe(true);
    expect(isExpired(jwt(Math.floor(Date.now() / 1000) + 600))).toBe(false);
  });
});

describe("parcours", () => {
  it("redirige vers /login sans jeton", () => {
    mount("/");
    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
  });

  it("affiche les erreurs de validation", async () => {
    mount("/login");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(screen.getByText("L'adresse courriel est requise.")).toBeInTheDocument();
    expect(screen.getByText("Le mot de passe est requis.")).toBeInTheDocument();
  });

  it("connecte et affiche le tableau de bord", async () => {
    const token = jwt(Math.floor(Date.now() / 1000) + 3600, "yassine@smartcampus.ma");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ token, tokenType: "Bearer" }), { status: 200 })));
    mount("/login");
    await userEvent.type(screen.getByLabelText("Adresse courriel"), "yassine@smartcampus.ma");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    await waitFor(() => expect(screen.getByText("Bonjour")).toBeInTheDocument());
    expect(screen.getAllByText("yassine@smartcampus.ma").length).toBeGreaterThan(0);
  });

  it("montre le message du serveur si identifiants invalides", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Identifiants invalides ou compte temporairement indisponible.", { status: 401 })));
    mount("/login");
    await userEvent.type(screen.getByLabelText("Adresse courriel"), "a@b.ma");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "x");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Identifiants invalides");
  });

  it("refuse l'inscription si les mots de passe diffèrent", async () => {
    mount("/register");
    await userEvent.type(screen.getByLabelText("Adresse courriel"), "a@b.ma");
    await userEvent.type(screen.getAllByLabelText("Mot de passe")[0], "password123");
    await userEvent.type(screen.getByLabelText("Confirmer le mot de passe"), "autre1234");
    await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));
    expect(screen.getByText("Les mots de passe ne correspondent pas.")).toBeInTheDocument();
  });
});
