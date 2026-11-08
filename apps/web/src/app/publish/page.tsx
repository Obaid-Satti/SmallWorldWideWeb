import { AppShell } from "@/components/layout/app-shell";
import { PublishForm } from "@/components/forms/publish-form";

export default function PublishPage() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-7 border-b border-slate-200 pb-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">Add your page to the small web</p>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl">Publish a small website</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">Choose a publisher name, pick a new address, and write the HTML for a page someone can discover.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
          <PublishForm />
        </div>
      </section>
    </AppShell>
  );
}
