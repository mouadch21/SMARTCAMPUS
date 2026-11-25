export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface LoginResponse {
  token: string;
  tokenType: string;
}

async function post(path: string, body: unknown): Promise<string> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Serveur injoignable. Réessayez dans un instant.");
  }
  const text = await res.text();
  if (!res.ok) throw new ApiError(res.status, text || `Erreur ${res.status}`);
  return text;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return JSON.parse(await post("/api/auth/login", { email, password }));
}

export async function register(email: string, password: string): Promise<void> {
  await post("/api/auth/register", { email, password });
}
