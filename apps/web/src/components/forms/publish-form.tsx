"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import type { Person } from "@/types/person";

const PERSON_KEY = "small-web-person";

export function PublishForm() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [author, setAuthor] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My small page</title>
</head>
<body>
  <main>
    <h1>Hello, small web.</h1>
    <p>Write a little something for someone to find.</p>
  </main>
</body>
</html>`);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedName = window.localStorage.getItem(PERSON_KEY);
    fetch(`${API_URL}/people`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the publisher names.");
        return response.json() as Promise<Person[]>;
      })
      .then((availablePeople) => {
        setPeople(availablePeople);
        setAuthor(availablePeople.find((person) => person.name === savedName)?.name ?? availablePeople[0]?.name ?? "");
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Could not load the publisher names.");
      })
      .finally(() => setLoadingPeople(false));
  }, []);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPublishing(true);

    try {
      const response = await fetch(`${API_URL}/sites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          address: address.trim().toLowerCase(),
          title: title.trim(),
          html: html.trim(),
        }),
      });
      const result = await response.json().catch(() => null) as { message?: string | string[] } | null;
      if (!response.ok) {
        const message = Array.isArray(result?.message) ? result.message.join(" ") : result?.message;
        throw new Error(message || (response.status === 409 ? "That address is already taken." : "Could not publish this page."));
      }

      router.push(`/visit?address=${encodeURIComponent(address.trim().toLowerCase())}&method=typed&entry=${window.crypto.randomUUID()}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not publish this page.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <form onSubmit={publish} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Publisher
          <select
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
            disabled={loadingPeople || people.length === 0}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          >
            {loadingPeople ? <option value="">Loading names…</option> : null}
            {!loadingPeople && people.length === 0 ? <option value="">No publisher names available</option> : null}
            {people.map((person) => <option key={person._id} value={person.name}>{person.name}</option>)}
          </select>
          <span className="mt-1.5 block text-xs font-normal text-slate-500">Choose a name from the available list.</span>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Site address
          <div className="mt-2 flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="yourname.zz"
              pattern="[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+"
              title="Use an address such as yourname.zz"
              maxLength={253}
              required
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-slate-800 outline-none placeholder:font-sans placeholder:text-slate-400"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <span className="mt-1.5 block text-xs font-normal text-slate-500">Use a unique small-web address, like garden.zz.</span>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Page title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="A title for your page"
          maxLength={120}
          required
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Page HTML
        <textarea
          value={html}
          onChange={(event) => setHtml(event.target.value)}
          maxLength={50000}
          required
          spellCheck={false}
          className="mt-2 min-h-80 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs leading-relaxed text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          aria-describedby="html-guidance"
        />
        <span id="html-guidance" className="mt-1.5 block text-xs font-normal text-slate-500">Write a complete HTML page. It will be shown inside a sandboxed frame.</span>
      </label>

      {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">Pages at an existing address can’t be replaced.</p>
        <button
          type="submit"
          disabled={loadingPeople || people.length === 0 || publishing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {publishing ? "Publishing…" : "Publish page"}
          {!publishing ? <span aria-hidden="true">↗</span> : null}
        </button>
      </div>
    </form>
  );
}
