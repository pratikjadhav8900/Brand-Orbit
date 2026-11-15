const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class FormValidationError extends Error {}

export function assertRequiredString(value: unknown, field: string, maxLength = 2000): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new FormValidationError(`${field} is required.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new FormValidationError(`${field} is too long.`);
  }
  return trimmed;
}

export function assertEmail(value: unknown): string {
  const email = assertRequiredString(value, "Email", 320);
  if (!EMAIL_RE.test(email)) {
    throw new FormValidationError("A valid email address is required.");
  }
  return email;
}

/** Honeypot field: real users never fill this hidden input. Non-empty means a bot. */
export function isSpam(body: Record<string, unknown>): boolean {
  return typeof body.website === "string" && body.website.trim().length > 0;
}
