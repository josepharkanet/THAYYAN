import { clsx, type ClassValue } from "clsx";

/** Merge conditional class names. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Turn a product name into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Applications are stored as a JSON string array; parse defensively. */
export function parseApplications(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // Fall back to comma-separated input.
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Normalise a phone number to digits with a country code for wa.me.
 * A bare 10-digit number (or 0-prefixed 11-digit) is assumed to be an Indian
 * mobile and gets the default country code, so WhatsApp doesn't guess the wrong
 * country (e.g. "6238493485" being read as +62 Indonesia).
 */
export function normalizePhone(raw: string, defaultCc = "91"): string {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2); // 00<cc>… international prefix
  if (d.length === 10) d = defaultCc + d; // bare 10-digit mobile
  else if (d.length === 11 && d.startsWith("0")) d = defaultCc + d.slice(1); // 0XXXXXXXXXX
  return d;
}

/** Build a wa.me link with an optional pre-filled message. */
export function whatsappLink(number: string, text?: string): string {
  const digits = normalizePhone(number);
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
