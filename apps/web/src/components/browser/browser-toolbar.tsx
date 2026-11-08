"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { createEntryId } from "@/lib/entry-id";
import type { SearchResult } from "@/types/site";

type NavigationCapabilities = EventTarget & {
  canGoBack: boolean;
  canGoForward: boolean;
};

const ADDRESS_PATTERN = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

function ArrowIcon({ direction }: { direction: "back" | "forward" }) {
  return direction === "back" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 5-7 7 7 7" />
      <path d="M8 12h12" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9.5 5 7 7-7 7" />
      <path d="M4 12h12" />
    </svg>
  );
}

export function BrowserToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [address, setAddress] = useState("");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setAddress(searchParams.get("address") ?? searchParams.get("q") ?? "");
  }, [searchParams]);

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
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [address]);

  useEffect(() => {
    const navigation = (window as Window & { navigation?: NavigationCapabilities }).navigation;
    const updateButtons = () => {
      if (navigation) {
        setCanGoBack(navigation.canGoBack);
        setCanGoForward(navigation.canGoForward);
      } else {
        setCanGoBack(window.history.length > 1);
        setCanGoForward(false);
      }
    };
    let updateTimer: number | undefined;
    const scheduleButtonUpdate = () => {
      window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(updateButtons, 0);
    };

    updateButtons();
    // Next.js may trigger the Navigation API event during its insertion effect.
    // Defer React state updates until that commit has finished.
    navigation?.addEventListener("currententrychange", scheduleButtonUpdate);
    window.addEventListener("popstate", updateButtons);
    return () => {
      navigation?.removeEventListener("currententrychange", scheduleButtonUpdate);
      window.clearTimeout(updateTimer);
      window.removeEventListener("popstate", updateButtons);
    };
  }, []);

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanAddress = address.trim();
    if (!cleanAddress) return;
    setSuggestionsOpen(false);
    if (ADDRESS_PATTERN.test(cleanAddress)) {
      router.push(`/visit?address=${encodeURIComponent(cleanAddress)}&method=typed&entry=${createEntryId()}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(cleanAddress)}`);
    }
  }

  function openAddress(value: string, method: "typed" | "search") {
    setSuggestionsOpen(false);
    router.push(`/visit?address=${encodeURIComponent(value)}&method=${method}&entry=${createEntryId()}`);
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="Go back"
          title="Go back"
          disabled={!canGoBack}
          onClick={() => router.back()}
          className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:cursor-default disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          <ArrowIcon direction="back" />
        </button>
        <button
          type="button"
          aria-label="Go forward"
          title="Go forward"
          disabled={!canGoForward}
          onClick={() => router.forward()}
          className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:cursor-default disabled:text-slate-300 disabled:hover:bg-transparent"
        >
          <ArrowIcon direction="forward" />
        </button>
      </div>

      <div className="relative min-w-0 flex-1">
        <form onSubmit={submitAddress} className="flex h-10 min-w-0 items-center rounded-full border border-slate-200 bg-slate-100 px-3 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 sm:px-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
          </svg>
          <input
            aria-label="Search or enter a small web address"
            aria-expanded={suggestionsOpen && address.trim().length >= 2}
            aria-controls="browser-suggestions"
            className="min-w-0 flex-1 bg-transparent font-mono text-xs text-slate-700 outline-none placeholder:font-sans placeholder:text-slate-400 sm:text-sm"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setSuggestionsOpen(true);
            }}
            onFocus={() => setSuggestionsOpen(true)}
            onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 150)}
            placeholder="Search or enter an address"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" aria-label="Search or go to address" className="ml-2 rounded-full px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">Go</button>
        </form>

        {suggestionsOpen && address.trim().length >= 2 ? (
          <div id="browser-suggestions" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
            {ADDRESS_PATTERN.test(address.trim()) ? (
              <button type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => openAddress(address.trim(), "typed")} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">↗</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">Visit {address.trim()}</span><span className="block text-xs text-slate-400">Open this address directly</span></span>
              </button>
            ) : null}

            {searching ? <p className="px-4 py-3 text-sm text-slate-500">Searching the small web…</p> : null}
            {suggestions
              .filter((result) => !ADDRESS_PATTERN.test(address.trim()) || result.address !== address.trim().toLowerCase())
              .slice(0, 5)
              .map((result) => (
              <button key={result.address} type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => openAddress(result.address, "search")} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-800">{result.title}</span><span className="block truncate font-mono text-[11px] text-blue-700">{result.address} · {result.author}</span><span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-slate-500">{result.snippet}</span></span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-500">{result.matchType === "address" ? "Address match" : "Page match"}</span>
              </button>
            ))}

            {!searching && suggestions.length === 0 && !ADDRESS_PATTERN.test(address.trim()) ? (
              <p className="px-4 py-3 text-sm text-slate-500">No matching pages found.</p>
            ) : null}
            <Link href={`/search?q=${encodeURIComponent(address.trim())}`} onClick={() => setSuggestionsOpen(false)} className="mt-1 block border-t border-slate-100 px-4 py-3 text-xs font-medium text-blue-700 hover:bg-blue-50">
              See all results for “{address.trim()}”
            </Link>
          </div>
        ) : null}
      </div>

      <Link href="/history" aria-label="Open browsing history" title="History" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      </Link>
    </div>
  );
}
