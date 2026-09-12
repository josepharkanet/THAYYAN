import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");
  const { from } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-center p-12 lg:p-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Stonic Marble & Granite"
            className="absolute left-12 top-12 h-8 w-auto brightness-0 invert lg:left-16 lg:top-16"
          />
          <p className="font-serif text-4xl font-light leading-tight text-white">
            Content Studio
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
            Manage products, categories and site content, everything on the
            website is editable from here.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 font-serif text-4xl font-light text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-2">
            Sign in to manage the Stonic Export website.
          </p>
          <div className="mt-10">
            <LoginForm from={from || "/admin"} />
          </div>
          <Link
            href="/"
            className="mt-8 inline-block text-[0.75rem] uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-ink"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
