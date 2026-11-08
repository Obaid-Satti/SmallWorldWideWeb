import { AppShell } from "@/components/layout/app-shell";
import { AddressForm } from "@/components/forms/address-form";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center px-5 pb-16 pt-16 text-center sm:pt-24">
        <div className="w-full max-w-2xl">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.2)]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
            </svg>
          </div>

          <h1 className="font-serif text-4xl font-normal tracking-tight text-slate-900 sm:text-5xl">
            The Small Web
          </h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            A little place to find something worth reading.
          </p>

          <div className="mt-8 sm:mt-10">
            <AddressForm />
          </div>

          <section className="mt-12" aria-labelledby="shortcuts-title">
            <h2 id="shortcuts-title" className="mb-3 text-xs font-medium text-slate-500">
              Start exploring
            </h2>
            <div className="flex justify-center">
              <Link
                href="/visit?address=tidepool.zz&method=link"
                className="group flex w-32 flex-col items-center rounded-xl px-3 py-4 transition hover:bg-white hover:shadow-sm"
              >
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-blue-700 transition group-hover:bg-blue-100">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                  </svg>
                </span>
                <span className="text-xs font-medium text-slate-700">Tide pool notes</span>
                <span className="mt-1 font-mono text-[10px] text-slate-400">tidepool.zz</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
