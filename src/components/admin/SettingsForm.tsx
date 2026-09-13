"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { ImageUpload, VideoUpload } from "./ImageUpload";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "video";
  hint?: string;
  full?: boolean;
};

const GROUPS: { title: string; note?: string; fields: Field[] }[] = [
  {
    title: "General",
    fields: [
      { key: "siteName", label: "Site name" },
      { key: "tagline", label: "Tagline" },
    ],
  },
  {
    title: "Hero",
    note: "The first thing visitors see on the homepage.",
    fields: [
      { key: "heroTitle", label: "Headline", full: true },
      { key: "heroSubtitle", label: "Sub-headline", type: "textarea", full: true },
      { key: "heroVideo", label: "Background video (optional)", type: "video", full: true },
      { key: "heroPoster", label: "Video poster image", type: "image", full: true },
      { key: "heroImage", label: "Fallback image (used when no video)", type: "image", full: true },
    ],
  },
  {
    title: "About",
    fields: [
      { key: "aboutHeading", label: "Story heading", full: true },
      { key: "aboutParagraphs", label: "Story text", type: "textarea", hint: "Separate paragraphs with a blank line.", full: true },
      { key: "aboutImage", label: "Proprietor / about image", type: "image", full: true },
      { key: "proprietorName", label: "Proprietor name" },
      { key: "proprietorRole", label: "Proprietor role" },
      { key: "foundedYear", label: "Founded year" },
    ],
  },
  {
    title: "Statistics",
    note: "Shown on the homepage and about page.",
    fields: [
      { key: "statYears", label: "Years of excellence" },
      { key: "statProducts", label: "Products delivered" },
      { key: "statCountries", label: "Countries served" },
      { key: "statQuality", label: "Quality assured" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "contactPhone1", label: "Phone 1" },
      { key: "contactPhone2", label: "Phone 2" },
      { key: "contactEmail", label: "Email" },
      { key: "whatsappNumber", label: "WhatsApp number", hint: "Digits only, incl. country code (e.g. 919544982471)." },
      { key: "address", label: "Location" },
    ],
  },
  {
    title: "Social links",
    fields: [
      { key: "instagramUrl", label: "Instagram URL" },
      { key: "facebookUrl", label: "Facebook URL" },
    ],
  },
  {
    title: "Social sharing",
    note: "The preview image shown when your links are shared on WhatsApp, Facebook, etc.",
    fields: [
      {
        key: "ogImage",
        label: "Share image (Open Graph)",
        type: "image",
        hint: "Best at 1200×630px. Leave empty to use the default site image.",
        full: true,
      },
    ],
  },
];

const inputCls =
  "w-full border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-sage";
const labelCls = "text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3";

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function onSave() {
    setSaving(true);
    setError("");
    try {
      await saveSettings(values);
      setSaved(true);
      router.refresh();
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Website</p>
          <h1 className="mt-3 font-serif text-4xl font-light text-ink">Site Content</h1>
          <p className="mt-2 text-ink-2">Edit the text and images across your website.</p>
        </div>
        <SaveButton saving={saving} saved={saved} onClick={onSave} />
      </div>

      {error ? (
        <p className="mt-6 border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mt-8 space-y-6">
        {GROUPS.map((group) => (
          <section key={group.title} className="border border-line bg-surface p-6">
            <h2 className="font-serif text-2xl text-ink">{group.title}</h2>
            {group.note ? <p className="mt-1 text-sm text-ink-3">{group.note}</p> : null}
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {group.fields.map((f) => (
                <div key={f.key} className={f.full || f.type === "textarea" || f.type === "image" || f.type === "video" ? "sm:col-span-2" : ""}>
                  <label className={labelCls} htmlFor={`s-${f.key}`}>{f.label}</label>
                  {f.type === "video" ? (
                    <div className="mt-2">
                      <VideoUpload value={values[f.key] ?? ""} onChange={(url) => set(f.key, url)} />
                    </div>
                  ) : f.type === "image" ? (
                    <div className="mt-2">
                      <ImageUpload value={values[f.key] ?? ""} onChange={(url) => set(f.key, url)} />
                    </div>
                  ) : f.type === "textarea" ? (
                    <textarea
                      id={`s-${f.key}`}
                      rows={f.key === "aboutParagraphs" ? 6 : 3}
                      className={`${inputCls} mt-2 resize-y`}
                      value={values[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      id={`s-${f.key}`}
                      className={`${inputCls} mt-2`}
                      value={values[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  )}
                  {f.hint ? <p className="mt-1 text-xs text-ink-3">{f.hint}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <SaveButton saving={saving} saved={saved} onClick={onSave} />
      </div>
    </div>
  );
}

function SaveButton({
  saving,
  saved,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 bg-ink px-7 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-sage disabled:opacity-60"
    >
      {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
      {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
    </button>
  );
}
