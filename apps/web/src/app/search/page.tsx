import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { searchSites } from "@/lib/sites-api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchSites(query) : [];

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl flex-1 px-5 pb-12 pt-7 sm:px-8">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <p className="text-xs text-slate-500">
            {results.length} {results.length === 1 ? "page" : "pages"} found for <span className="font-medium text-slate-700">“{query}”</span>
          </p>
        </div>

        {results.length ? (
          <ol className="space-y-1">
            {results.map((result) => (
              <li key={result.address}>
                <Link
                  href={{ pathname: "/visit", query: { address: result.address, method: "search" } }}
                  className="group flex gap-3 rounded-xl px-3 py-4 transition hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <span aria-hidden="true" className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-slate-600">{result.address} <span className="text-slate-400">·</span> {result.author}</span>
                    <span className="mt-1 block text-lg leading-snug text-[#1a0dab] group-hover:underline">{result.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{result.snippet}</span>
                  </span>
                  <span aria-hidden="true" className="mt-2 hidden text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600 sm:block">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </span>
            <h1 className="font-serif text-2xl text-slate-800">No pages found</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Nothing matched “{query}”. Try a different word or phrase in the browser bar.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
