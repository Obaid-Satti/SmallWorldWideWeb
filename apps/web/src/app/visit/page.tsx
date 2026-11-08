import { randomUUID } from "node:crypto";
import { AppShell } from "@/components/layout/app-shell";
import { getSiteByAddress } from "@/features/sites/api/get-site-by-address";
import { SiteFrame } from "@/features/sites/components/site-frame";
import { SiteNotFound } from "@/features/sites/components/site-not-found";
import { VisitRecorder } from "@/features/visits/components/visit-recorder";

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
