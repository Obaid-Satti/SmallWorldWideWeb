import Link from "next/link";
import { Button, Alert, Badge } from "@/components/ui";
import { AddressForm } from "@/components/forms/address-form";

export function SiteNotFound({ address }: { address: string }) {
  return (
    <div className="w-full max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">
      <Badge variant="danger" hasDot className="mb-4">
        NOWHERE · 404
      </Badge>

      <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal tracking-tight mb-2">
        We couldn’t find that place.
      </h1>

      <p className="font-mono text-sm text-blue-700 mb-4 bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-200">
        {address || "No address entered"}
      </p>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 max-w-md">
        There isn’t a site at this address yet. It might be an uncharted link or
        a corner of the small web waiting to be written.
      </p>

      <div className="w-full mb-6">
        <AddressForm defaultValue={address} />
      </div>

      <Alert variant="warning" className="w-full text-left mb-6">
        <strong>Uncharted Address.</strong> In the small web, links may lead to
        places that never existed. You can type another address or return home.
      </Alert>

      <Link href="/">
        <Button variant="outline" size="md" leftIcon={<span>←</span>}>
          Back to the Small Web
        </Button>
      </Link>
    </div>
  );
}
