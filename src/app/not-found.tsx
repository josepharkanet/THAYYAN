import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-6xl font-light text-ink sm:text-8xl">
        Page not found
      </h1>
      <p className="mt-5 max-w-sm text-ink-2">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 bg-ink px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sage"
      >
        Back to Home
      </Link>
    </main>
  );
}
