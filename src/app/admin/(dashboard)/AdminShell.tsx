"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Newspaper,
  Wrench,
  Sparkles,
  Hammer,
  Settings,
  ClipboardList,
  Star,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", icon: ClipboardList },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/works", label: "Works", icon: Hammer },
  { href: "/admin/feedback", label: "Feedback", icon: Star },
  { href: "/admin/values", label: "Values", icon: Sparkles },
  { href: "/admin/settings", label: "Site Content", icon: Settings },
];

export default function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-ink px-5 py-4 text-paper lg:hidden">
        <span className="font-serif text-xl font-medium">
          STONIC <span className="text-[0.6rem] uppercase tracking-[0.3em] text-paper/50">Admin</span>
        </span>
        <button aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-paper transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="hidden items-center gap-2 px-6 py-6 lg:flex">
          <span className="font-serif text-2xl font-medium">STONIC</span>
          <span className="text-[0.6rem] uppercase tracking-[0.28em] text-paper/50">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 lg:py-2">
          {NAV.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-paper/10 text-paper"
                    : "text-paper/60 hover:bg-paper/5 hover:text-paper",
                )}
              >
                <item.icon size={18} strokeWidth={1.6} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper/10 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
          >
            <ExternalLink size={18} strokeWidth={1.6} />
            View Website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
            >
              <LogOut size={18} strokeWidth={1.6} />
              Sign Out
            </button>
          </form>
          <p className="mt-3 px-3 text-xs text-paper/40">Signed in as {userName}</p>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Main */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </div>
    </div>
  );
}
