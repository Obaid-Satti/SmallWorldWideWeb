import Link from "next/link";

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">

      {/* ── Header ───────────────────────────────────── */}
      <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 gap-4">

        {/* Left: Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 no-underline group flex-shrink-0"
        >
          {/* Icon badge */}
          <span className="w-9 h-9 grid place-items-center bg-blue-600 text-white rounded-xl shadow-[0_2px_8px_rgba(37,99,235,0.28)] transition-transform duration-150 group-hover:scale-105 flex-shrink-0">
            {/* Globe icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </span>
          {/* Name */}
          <span className="text-lg font-bold text-slate-900 tracking-tight font-serif leading-none">
            Small Web
          </span>
        </Link>

        {/* Right: Identity pill */}
        <div className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-full flex-shrink-0">
          {/* Avatar */}
          <span className="w-7 h-7 grid place-items-center rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] flex-shrink-0">
            O
          </span>
          {/* Labels */}
          <div className="flex flex-col leading-none gap-[3px] hidden sm:flex">
            <span className="text-[9px] uppercase tracking-widest text-slate-400">Browsing as</span>
            <span className="text-[12px] font-semibold text-slate-800">Obaid</span>
          </div>
          {/* Online dot */}
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-100 flex-shrink-0"
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 text-[11px] text-slate-400">
        <span>Small pages, connected by curiosity.</span>
        <span className="font-mono text-[10px] text-slate-300 tracking-wide hidden sm:block">
          Next.js · NestJS · MongoDB
        </span>
      </footer>

    </div>
  );
}
