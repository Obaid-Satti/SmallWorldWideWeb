"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Visit } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const PERSON_KEY = "small-web-person";
const PERSON_READY_EVENT = "small-web-person-ready";
const PERSON_CHANGE_EVENT = "small-web-person-change";

function dayGroupLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(date);
}

function visitMethodLabel(method: Visit["method"]) {
  return {
    typed: "Address",
    link: "Link",
    history: "Reopened",
    search: "Search",
  }[method];
}

export function HistoryList() {
  const [person, setPerson] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const hasActiveFilters = Boolean(searchQuery.trim()) || dateFilter !== "all" || methodFilter !== "all";
  const filteredVisits = visits.filter((visit) => {
    const queryMatches = `${visit.title} ${visit.address}`.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const methodMatches = methodFilter === "all" || visit.method === methodFilter;
    const visitDate = new Date(visit.visitedAt);
    const ageInDays = (Date.now() - visitDate.getTime()) / (1000 * 60 * 60 * 24);
    const dateMatches = dateFilter === "all"
      || (dateFilter === "today" && dayGroupLabel(visit.visitedAt) === "Today")
      || (dateFilter === "week" && ageInDays >= 0 && ageInDays <= 7)
      || (dateFilter === "month" && ageInDays >= 0 && ageInDays <= 30);

    return queryMatches && methodMatches && dateMatches;
  });
  const groups = filteredVisits.reduce<Array<{ label: string; entries: Visit[] }>>((result, visit) => {
    const label = dayGroupLabel(visit.visitedAt);
    const lastGroup = result[result.length - 1];
    if (lastGroup?.label === label) lastGroup.entries.push(visit);
    else result.push({ label, entries: [visit] });
    return result;
  }, []);

  function clearFilters() {
    setSearchQuery("");
    setDateFilter("all");
    setMethodFilter("all");
  }

  useEffect(() => {
    const updatePerson = () => setPerson(window.localStorage.getItem(PERSON_KEY) ?? "");
    updatePerson();
    window.addEventListener(PERSON_READY_EVENT, updatePerson);
    window.addEventListener(PERSON_CHANGE_EVENT, updatePerson);
    return () => {
      window.removeEventListener(PERSON_READY_EVENT, updatePerson);
      window.removeEventListener(PERSON_CHANGE_EVENT, updatePerson);
    };
  }, []);

  useEffect(() => {
    if (!person) {
      setVisits([]);
      setLoading(true);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`${API_URL}/visits?person=${encodeURIComponent(person)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load history.");
        return response.json() as Promise<Visit[]>;
      })
      .then(setVisits)
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [person]);

  return (
    <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-9 sm:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div className="flex items-start gap-3.5">
          <span aria-hidden="true" className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5M12 7v5l3 2" />
            </svg>
          </span>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">The Small Web</p>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl">Browsing history</h1>
            <p className="mt-1.5 text-sm text-slate-500">Revisit a page and pick up where you left off.</p>
          </div>
        </div>
        <div className="self-start sm:self-auto">
          {!loading && !error && visits.length > 0 ? (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
              {hasActiveFilters ? `${filteredVisits.length} of ${visits.length}` : visits.length} {visits.length === 1 && !hasActiveFilters ? "visit" : "visits"}
            </span>
          ) : null}
        </div>
      </div>

      {!loading && !error && visits.length > 0 ? (
        <div className="mb-6 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_9.5rem_8.5rem]">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <input
              type="search"
              aria-label="Search browsing history"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search pages or addresses"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="relative min-w-0">
            <select
              aria-label="Filter history by date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">Any time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 7.5 5 5 5-5" /></svg>
          </div>
          <div className="relative min-w-0">
            <select
              aria-label="Filter history by visit type"
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All activity</option>
              <option value="typed">Address</option>
              <option value="search">Search</option>
              <option value="link">Link</option>
              <option value="history">Reopened</option>
            </select>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 7.5 5 5 5-5" /></svg>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3" aria-label="Loading browsing history">
          {[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" />)}
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-800">
          Could not load history. Check that the API is running, then refresh this page.
        </div>
      ) : null}

      {!loading && !error && visits.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5M12 7v5l3 2" />
            </svg>
          </span>
          <h2 className="font-serif text-xl text-slate-800">Your trail starts here</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Visit a page and it will appear here, ready to reopen whenever you like.</p>
          <Link href="/" className="mt-5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">Explore the small web</Link>
        </div>
      ) : null}

      {!loading && !error && visits.length > 0 && filteredVisits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-5 py-10 text-center">
          <p className="font-medium text-slate-800">No visits match these filters</p>
          <p className="mt-1 text-sm text-slate-500">Try another search or clear the filters.</p>
          <button type="button" onClick={clearFilters} className="mt-4 rounded-full px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">Clear filters</button>
        </div>
      ) : null}

      {!loading && !error && groups.length > 0 ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.label} aria-label={group.label}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</h2>
              <ol className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {group.entries.map((visit, index) => {
                  const isNowhere = visit.title === "Nowhere";
                  return (
                    <li key={visit._id} className={index > 0 ? "border-t border-slate-100" : ""}>
                      <Link
                        href={{ pathname: "/visit", query: { address: visit.address, method: "history" } }}
                        className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50 sm:gap-4 sm:px-5"
                      >
                        <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isNowhere ? "bg-rose-50 text-rose-500" : "bg-sky-50 text-blue-600"}`}>
                          {isNowhere ? (
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-blue-700">{isNowhere ? visit.address : visit.title}</span>
                          <span className="mt-0.5 block truncate font-mono text-xs text-slate-500">{isNowhere ? "No site at this address" : visit.address}</span>
                        </span>
                        <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500 sm:inline-flex">{visitMethodLabel(visit.method)}</span>
                        <time className="w-16 shrink-0 text-right text-xs tabular-nums text-slate-500" dateTime={visit.visitedAt}>
                          {new Date(visit.visitedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </time>
                        <span aria-hidden="true" className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600">↗</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      ) : null}
    </section>
  );
}
