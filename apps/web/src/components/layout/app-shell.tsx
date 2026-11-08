import Link from "next/link";
import { Suspense } from "react";
import { BrowserIdentityPicker } from "@/components/browser/browser-identity-picker";
import { BrowserToolbar } from "@/components/browser/browser-toolbar";

export function AppShell({
  children,
  showFooter = true,
}: Readonly<{ children: React.ReactNode; showFooter?: boolean }>) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">

      {/* ── Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-12 items-center justify-between gap-2 px-2.5 sm:gap-4 sm:px-6">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
            </span>
            <span className="truncate font-serif text-xs font-bold tracking-tight text-slate-800 sm:text-sm">Small Web</span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/publish"
              aria-label="Publish a page"
              title="Publish a page"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:px-3"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 4v12M4 10h12" />
              </svg>
              <span className="hidden sm:inline">Publish</span>
            </Link>
            <BrowserIdentityPicker />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-100 px-2 py-1.5 sm:px-5">
          <Suspense fallback={<div className="h-10 flex-1 rounded-full bg-slate-100" />}>
            <BrowserToolbar />
          </Suspense>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      {/* ── Footer ───────────────────────────────────── */}
      {showFooter ? (
        <footer className="border-t border-slate-200 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>Small pages, connected by curiosity.</span>
          <span className="font-mono text-[10px] text-slate-300 tracking-wide hidden sm:block">
            Next.js · NestJS · MongoDB
          </span>
        </footer>
      ) : null}

    </div>
  );
}
