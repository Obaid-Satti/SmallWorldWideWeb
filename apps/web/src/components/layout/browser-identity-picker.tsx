"use client";

import { useEffect, useState } from "react";

type Person = { _id: string; name: string };

const STORAGE_KEY = "small-web-person";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function BrowserIdentityPicker() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [loadError, setLoadError] = useState(false);

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
        setSelectedName(savedPerson?.name ?? availablePeople[0]?.name ?? "");
      })
      .catch(() => setLoadError(true));
  }, []);

  function selectPerson(name: string) {
    setSelectedName(name);
    window.localStorage.setItem(STORAGE_KEY, name);
  }

  const initials = selectedName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <label className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full flex-shrink-0">
      <span aria-hidden="true" className="w-7 h-7 grid place-items-center rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] flex-shrink-0">
        {initials || "?"}
      </span>
      <span className="flex flex-col leading-none gap-1">
        <span className="text-[9px] uppercase tracking-widest text-slate-400">Browsing as</span>
        <select
          aria-label="Choose who is browsing"
          className="max-w-36 bg-transparent text-[12px] font-semibold text-slate-800 outline-none cursor-pointer"
          disabled={people.length === 0}
          value={selectedName}
          onChange={(event) => selectPerson(event.target.value)}
        >
          {people.length === 0 ? (
            <option value="">{loadError ? "Start API and seed names" : "Loading names…"}</option>
          ) : null}
          {people.map((person) => (
            <option key={person._id} value={person.name}>{person.name}</option>
          ))}
        </select>
      </span>
      <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-100 flex-shrink-0" />
    </label>
  );
}
