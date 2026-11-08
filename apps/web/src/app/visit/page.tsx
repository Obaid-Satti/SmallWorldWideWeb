import { randomUUID } from "node:crypto";
import { AppShell } from "@/components/layout/app-shell";
import { getSiteByAddress } from "@/lib/sites-api";
import { SiteFrame } from "@/components/sites/site-frame";
import { SiteNotFound } from "@/components/sites/site-not-found";
import { VisitRecorder } from "@/components/history/visit-recorder";

export default async function VisitPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string; method?: string; entry?: string }>;
}) {
  const { address = "", method: requestedMethod, entry: requestedEntry } = await searchParams;
  const method = requestedMethod === "link" || requestedMethod === "history" || requestedMethod === "search" ? requestedMethod : "typed";
  const entryId = requestedEntry || randomUUID();
  const site = address ? await getSiteByAddress(address) : null;

  return (
    <AppShell showFooter={false}>
      {address ? <VisitRecorder key={`recorder-${entryId}`} address={address} title={site?.title ?? "Nowhere"} method={method} entryId={entryId} /> : null}
      {site ? <SiteFrame key={`frame-${entryId}`} site={site} entryId={entryId} /> : <SiteNotFound address={address} />}
    </AppShell>
  );
}
