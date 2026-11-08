import { AppShell } from "@/components/layout/app-shell";
import { AddressForm } from "@/components/forms/address-form";
import { Badge, Card, Alert } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell>
      <div className="w-full max-w-2xl mx-auto px-6 py-12 sm:py-18 flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <Badge variant="primary" hasDot className="mb-4">
          THE SMALL WEB · FIRST STEP
        </Badge>

        {/* Hero title */}
        <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 font-normal tracking-tight mb-3">
          Open a small <em className="italic text-blue-600">website.</em>
        </h1>

        {/* Intro description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed">
          Enter a site address to find and read its page living in the database.
          A quiet network of handcrafted personal sites.
        </p>

        {/* Address Form */}
        <div className="w-full max-w-md mb-8">
          <AddressForm />
        </div>

        {/* Sample Site Callout Card */}
        <div className="w-full max-w-md">
          <Card className="p-4 text-left border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                Sample Address
              </span>
              <Badge variant="mono">tidepool.zz</Badge>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Explore coastal notes and rock pool observations by Mara Finch.
            </p>
            <Link
              href="/visit?address=tidepool.zz"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline font-mono"
            >
              Open tidepool.zz ↗
            </Link>
          </Card>
        </div>

        {/* Info Alert */}
        <div className="w-full max-w-md mt-6">
          <Alert variant="neutral" className="text-left">
            <span>
              Each site is an isolated document written in standard HTML,
              contained safely within a sandboxed browser frame.
            </span>
          </Alert>
        </div>
      </div>
    </AppShell>
  );
}
