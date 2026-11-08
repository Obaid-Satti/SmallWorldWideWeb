"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL } from "@/lib/config";
import type { Person } from "@/types/person";

const STORAGE_KEY = "small-web-person";
const PERSON_READY_EVENT = "small-web-person-ready";
const PERSON_CHANGE_EVENT = "small-web-person-change";

export function BrowserIdentityPicker() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedName = window.localStorage.getItem(STORAGE_KEY);

    fetch(`${API_URL}/people`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load browsing names.");
        return response.json() as Promise<Person[]>;
      })
      .then((availablePeople) => {
        setPeople(availablePeople);
        const savedPerson = availablePeople.find((person) => person.name === savedName);
        const name = savedPerson?.name ?? availablePeople[0]?.name ?? "";
        setSelectedName(name);
        if (name) {
          window.localStorage.setItem(STORAGE_KEY, name);
          window.dispatchEvent(new Event(PERSON_READY_EVENT));
        }
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  function selectPerson(name: string) {
    setSelectedName(name);
    window.localStorage.setItem(STORAGE_KEY, name);
    window.dispatchEvent(new Event(PERSON_CHANGE_EVENT));
    setIsOpen(false);
  }

  const initials = selectedName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={pickerRef} className="relative shrink-0" onKeyDown={(event) => {
      if (event.key === "Escape") setIsOpen(false);
    }}>
      <button
        type="button"
        aria-label={selectedName ? `Switch browsing user. Current user: ${selectedName}` : "Switch browsing user"}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={people.length === 0}
        onClick={() => setIsOpen((open) => !open)}
        title={loadError ? "Start the API and seed the database to load names" : "Change browsing name"}
        className="flex h-10 max-w-52 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-default disabled:opacity-70"
      >
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-semibold text-blue-700">
          {initials || "…"}
        </span>
        <span className="max-w-32 truncate text-xs font-semibold text-slate-700">
          {selectedName || (loadError ? "Names unavailable" : "Loading…")}
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      {isOpen ? (
        <div role="listbox" aria-label="Switch browsing user" className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Switch user</p>
          {people.map((person) => {
            const isSelected = person.name === selectedName;
            const personInitials = person.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
            return (
              <button
                key={person._id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectPerson(person.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${isSelected ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-50"}`}
              >
                <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${isSelected ? "bg-white text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {personInitials}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{person.name}</span>
                {isSelected ? (
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10 4 4 8-8" /></svg>
                ) : null}
              </button>
            );
          })}
          <p className="mt-2 border-t border-slate-100 px-3 pb-1 pt-3 text-[11px] text-slate-400">Each user has a separate browsing history.</p>
        </div>
      ) : null}
    </div>
  );
}
