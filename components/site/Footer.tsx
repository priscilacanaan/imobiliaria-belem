import { siteSettings } from "@/content/seed";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-sand-200 bg-sand-100">
      <div className="container-site flex flex-col gap-6 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl text-ink-900">{siteSettings.brandName}</p>
          <p className="mt-2 max-w-sm text-sm text-ink-700">{siteSettings.tagline}</p>
        </div>
        <div className="text-sm text-ink-700">
          <p>{siteSettings.phone}</p>
          <p>{siteSettings.email}</p>
          <p>{siteSettings.city}</p>
        </div>
      </div>
      <div className="container-site pb-8 text-xs text-ink-500">
        © {new Date().getFullYear()} {siteSettings.brandName}. Dados de exemplo.
      </div>
    </footer>
  );
}
