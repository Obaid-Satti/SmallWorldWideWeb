"use client";

import { Input, Button } from "@/components/ui";

export function AddressForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form
      className="w-full flex items-center gap-2 max-w-lg"
      action="/visit"
      method="get"
    >
      <div className="flex-1 min-w-0">
        <Input
          id="address"
          name="address"
          defaultValue={defaultValue}
          aria-label="Website address"
          placeholder="Try tidepool.zz"
          leftElement={
            <span className="text-[var(--primary)] font-mono font-bold text-base">
              ↗
            </span>
          }
          sizeVariant="lg"
          className="font-mono text-sm"
          autoComplete="off"
          spellCheck={false}
          required
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="shrink-0 px-5 font-mono shadow-xs"
        rightIcon={<span>→</span>}
      >
        Go
      </Button>
    </form>
  );
}
