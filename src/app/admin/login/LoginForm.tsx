"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="from" value={from} />

      <div>
        <label
          htmlFor="email"
          className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-3"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2 w-full border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-sage"
          placeholder="you@stonicexport.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-3"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-sage"
          placeholder="••••••••"
        />
      </div>

      {state?.error ? (
        <p className="border-l-2 border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink px-6 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-sage disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
