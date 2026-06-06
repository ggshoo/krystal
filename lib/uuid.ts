/**
 * Tiny UUIDv4 generator. Used for the `client_uuid` idempotency key on
 * `daily_checkins` so offline submission retries are dedupable server-side.
 *
 * Prefers Hermes/native `crypto.randomUUID()` when available, falls back to
 * a Math.random() shim. Not cryptographically secure — fine for our use.
 */
export function uuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
