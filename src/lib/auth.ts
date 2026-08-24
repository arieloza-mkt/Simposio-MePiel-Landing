const COOKIE_NAME = "simposio_admin";
const SESSION_DAYS = 7;

async function hmac(payload: string): Promise<string> {
  const secret =
    process.env.AUTH_SECRET ?? "dev-only-secret-cambiar-en-produccion";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const signature = await hmac(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

export async function isValidSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;
  const expected = await hmac(expiresAt);
  return signature === expected;
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.warn("[auth] ADMIN_PASSWORD no está configurada");
    return false;
  }
  return password === expected;
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
