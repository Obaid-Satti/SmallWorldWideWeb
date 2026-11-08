import Link from "next/link";
import type { Site } from "../types";
import { Button, Badge } from "@/components/ui";
import { AddressForm } from "@/components/forms/address-form";

export function SiteFrame({ site }: { site: Site }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      {/* Navigation bar with AddressForm and Back to Home */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" leftIcon={<span>←</span>}>
              Home
            </Button>
          </Link>
          <Badge variant="primary" hasDot className="font-mono">
            {site.address}
          </Badge>
        </div>

        <div className="flex-1 max-w-md">
          <AddressForm defaultValue={site.address} />
        </div>

        <Badge variant="success" hasDot className="hidden md:inline-flex self-center">
          Sandboxed
        </Badge>
      </div>

      {/* Site Header */}
      <div>
        <p className="text-[11px] font-mono tracking-widest text-slate-500 uppercase mb-1">
          {site.address} · Written by {site.author}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal tracking-tight">
          {site.title}
        </h1>
      </div>

      {/* Browser Viewport Window Frame */}
      <div className="w-full bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Window Chrome Header */}
        <div className="h-10 px-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            </div>
            <span className="font-mono text-[11px] text-slate-600 font-medium">
              smallweb://{site.address}
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            ISOLATED DOCUMENT
          </span>
        </div>

        {/* Sandboxed iframe */}
        <div className="w-full bg-white relative min-h-[540px]">
          <iframe
            className="w-full h-full min-h-[540px] border-0 block"
            title={site.title}
            sandbox="allow-scripts"
            srcDoc={site.html}
          />
        </div>

        {/* Viewport Footer Bar */}
        <div className="h-8 px-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Containment: sandbox=&quot;allow-scripts&quot;</span>
          <span>THE SMALL WEB</span>
        </div>
      </div>
    </div>
  );
}
