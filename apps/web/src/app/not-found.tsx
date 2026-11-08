import Link from "next/link";
import { Button, Badge } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fafbfc] text-center">
      <Badge variant="danger" hasDot className="mb-3">
        404 · PAGE NOT FOUND
      </Badge>
      <h1 className="font-serif text-3xl font-medium text-slate-900 mb-2">
        Edge of the Small Web
      </h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        This internal browser path does not exist. Return to the browser home or explore
        the small web.
      </p>
      <Link href="/">
        <Button variant="primary" size="md" leftIcon={<span>←</span>}>
          Return to Browser Home
        </Button>
      </Link>
    </div>
  );
}

