"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { createEntryId } from "@/lib/entry-id";
import type { SearchResult } from "@/types/site";
const ADDRESS_PATTERN = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

export function AddressForm({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [address, setAddress] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const query = address.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error("Search failed.");
          return response.json() as Promise<SearchResult[]>;
        })
        .then(setSuggestions)
        .catch((cause: unknown) => {
          if (!(cause instanceof Error && cause.name === "AbortError")) setSuggestions([]);
        })
        .finally(() => setSearching(false));
    }, 200);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [address]);

  function goToAddress(value: string) {
    const cleanAddress = value.trim();
    if (!cleanAddress) return;
    setSuggestionsOpen(false);
    if (ADDRESS_PATTERN.test(cleanAddress)) {
      router.push(`/visit?address=${encodeURIComponent(cleanAddress)}&method=typed&entry=${createEntryId()}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(cleanAddress)}`);
    }
  }

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToAddress(address);
  }

  const exactAddress = ADDRESS_PATTERN.test(address.trim());
  const matchingPages = suggestions
    .filter((result) => !exactAddress || result.address !== address.trim().toLowerCase())
    .slice(0, 5);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <form onSubmit={submitAddress}>
        <div className="flex h-14 items-center rounded-full border border-slate-200 bg-white px-5 shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:shadow-[0_4px_14px_rgba(15,23,42,0.12)] focus-within:border-blue-300 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-3 h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            id="address"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => setSuggestionsOpen(true)}
            onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 150)}
            aria-label="Search or enter a small web address"
            aria-expanded={suggestionsOpen && address.trim().length >= 2}
            aria-controls="home-search-suggestions"
            placeholder="Search or enter an address"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            autoComplete="off"
            spellCheck={false}
            required
          />
          <button type="submit" aria-label="Search or go to address" className="ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-blue-700 transition hover:bg-blue-50">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>

      {suggestionsOpen && address.trim().length >= 2 ? (
        <div id="home-search-suggestions" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 text-left shadow-xl">
          {exactAddress ? (
            <button type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => goToAddress(address)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50">
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">↗</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">Visit {address.trim()}</span><span className="block text-xs text-slate-400">Open this address directly</span></span>
            </button>
          ) : null}

          {searching ? <p className="px-4 py-3 text-sm text-slate-500">Searching the small web…</p> : null}
          {matchingPages.map((result) => (
            <button key={result.address} type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => goToAddress(result.address)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">{result.title}</span><span className="block truncate font-mono text-[11px] text-blue-700">{result.address} · {result.author}</span><span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-slate-500">{result.snippet}</span></span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-500">{result.matchType === "address" ? "Address match" : "Page match"}</span>
            </button>
          ))}

          {!searching && matchingPages.length === 0 && !exactAddress ? <p className="px-4 py-3 text-sm text-slate-500">No matching pages found.</p> : null}
          <Link href={`/search?q=${encodeURIComponent(address.trim())}`} onClick={() => setSuggestionsOpen(false)} className="mt-1 block border-t border-slate-100 px-4 py-3 text-xs font-medium text-blue-700 hover:bg-blue-50">
            See all results for “{address.trim()}”
          </Link>
        </div>
      ) : null}
    </div>
  );
}
