import { AppShell } from "@/components/layout/app-shell";
import { getSiteByAddress } from "@/features/sites/api/get-site-by-address";
import { SiteFrame } from "@/features/sites/components/site-frame";
import { SiteNotFound } from "@/features/sites/components/site-not-found";

export default async function VisitPage({
  searchParams,
}: {
  searchParams: Promise<{ address?: string }>;
}) {
  const { address = "" } = await searchParams;
  const site = address ? await getSiteByAddress(address) : null;

  return <AppShell>{site ? <SiteFrame site={site} /> : <SiteNotFound address={address} />}</AppShell>;
}
