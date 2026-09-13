"use client";

// Lightweight client-side "ready stock" selection list, persisted to localStorage
// and shared across components via a custom window event (no state library needed).

export type EnquiryItem = {
  slug: string;
  name: string;
  imageUrl: string;
  qty: number;
};

const KEY = "stonic_enquiry_v1";
const EVT = "stonic-enquiry-change";

export function getEnquiry(): EnquiryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EnquiryItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: EnquiryItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVT));
}

export function addToEnquiry(item: EnquiryItem) {
  const items = getEnquiry();
  if (!items.some((i) => i.slug === item.slug)) {
    items.push({ ...item, qty: item.qty || 1 });
    save(items);
  }
}

export function removeFromEnquiry(slug: string) {
  save(getEnquiry().filter((i) => i.slug !== slug));
}

export function setEnquiryQty(slug: string, qty: number) {
  save(getEnquiry().map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i)));
}

export function clearEnquiry() {
  save([]);
}

export function inEnquiry(slug: string): boolean {
  return getEnquiry().some((i) => i.slug === slug);
}

export function onEnquiryChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}
