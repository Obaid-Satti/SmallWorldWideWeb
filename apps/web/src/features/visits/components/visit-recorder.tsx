"use client";

import { useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const PERSON_KEY = "small-web-person";
const PERSON_READY_EVENT = "small-web-person-ready";

export function VisitRecorder({
  address,
  title,
  method,
  entryId,
}: {
  address: string;
  title: string;
  method: "typed" | "link" | "history" | "search";
  entryId: string;
}) {
  const recorded = useRef(false);

  useEffect(() => {
    if (!address || recorded.current) return;

    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has("entry")) {
      currentUrl.searchParams.set("entry", entryId);
      window.history.replaceState(window.history.state, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    }

    async function recordVisit() {
      const person = window.localStorage.getItem(PERSON_KEY);
      if (!person || recorded.current) return;
      recorded.current = true;

      try {
        const response = await fetch(`${API_URL}/visits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ person, address, title, method }),
        });
        if (!response.ok) recorded.current = false;
      } catch {
        recorded.current = false;
      }
    }

    void recordVisit();
    window.addEventListener(PERSON_READY_EVENT, recordVisit);
    return () => window.removeEventListener(PERSON_READY_EVENT, recordVisit);
  }, [address, title, method, entryId]);

  return null;
}
