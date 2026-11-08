"use client";

import { Input, Button } from "@/components/ui";

export function SearchForm() {
  return (
    <form
      className="w-full flex items-center gap-2 max-w-lg"
      action="/search"
      method="get"
    >
      <div className="flex-1 min-w-0">
        <Input
          id="query"
          name="q"
          aria-label="Search site pages"
          placeholder="Search pages by their words…"
          leftElement={
            <span className="text-[var(--muted)] text-base">
              ⌕
            </span>
          }
          sizeVariant="lg"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="shrink-0 px-5"
        rightIcon={<span>↗</span>}
      >
        Search
      </Button>
    </form>
  );
}

