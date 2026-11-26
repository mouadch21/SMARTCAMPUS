import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";
import { AuthProvider } from "../auth/AuthContext";
import { displayName } from "../auth/session";

function jwt(exp: number, sub: string) {
  const b = (o: object) => btoa(JSON.stringify(o)).replace(/=/g, "");
  return `${b({ alg: "HS256" })}.${b({ sub, exp, iat: exp - 3600 })}.sig`;
}
function mount(path: string, secondsLeft = 3600) {
  sessionStorage.setItem("smartcampus.token", jwt(Math.floor(Date.now() / 1000) + secondsLeft, "yassine.habachi@smartcampus.ma"));
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}
beforeEach(() => sessionStorage.clear());

describe("profil et session", () => {
  it("déduit un nom d'affichage", () => {
    expect(displayName("yassine.habachi@x.ma")).toBe("Yassine Habachi");
    expect(displayName(null)).toBe("Utilisateur");
  });
  it("affiche la page profil", () => {
    mount("/profil");
    expect(screen.getByRole("heading", { name: "Yassine Habachi" })).toBeInTheDocument();
    expect(screen.getByText("Temps restant")).toBeInTheDocument();
  });
  it("protège /profil sans jeton", () => {
    render(<MemoryRouter initialEntries={["/profil"]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
  });
  it("avertit quand la session expire bientôt", () => {
    mount("/", 120);
    expect(screen.getByRole("status")).toHaveTextContent("Votre session expire dans");
  });
  it("pas d'avertissement avec une session longue", () => {
    mount("/", 3600);
    expect(screen.queryByText(/Votre session expire dans/)).toBeNull();
  });
  it("demande confirmation avant la déconnexion", async () => {
    mount("/");
    await userEvent.click(screen.getByRole("button", { name: "Se déconnecter" }));
    await userEvent.click(screen.getByRole("button", { name: "Confirmer" }));
    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
  });
});
