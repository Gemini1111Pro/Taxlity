import Link from "next/link";

export default function Home() {
  return (
    <section className="container py-12 space-y-8">
      <div className="rounded-3xl p-10 bg-gradient-to-br from-indigo-50 via-white to-pink-50 border">
        <h1 className="h1">Salary & Freelance Tax Calculator</h1>
        <p className="sub mt-2 max-w-2xl">Federal-only, local currency, multi-country (US, UK, Canada, Australia, Pakistan) with financial year selection.</p>
        <div className="mt-6 flex gap-4">
          <Link href="/salary" className="btn">Salary Calculator</Link>
          <Link href="/freelancer" className="btn">Freelancer Calculator</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-medium">Multi-country</h3>
          <p className="sub">US, UK, Canada, Australia, Pakistan — local symbols and FY mapping.</p>
        </div>
        <div className="card">
          <h3 className="font-medium">Two calculators</h3>
          <p className="sub">Salary (employment) and Freelance (self-employed) flows.</p>
        </div>
        <div className="card">
          <h3 className="font-medium">SEO & Ads ready</h3>
          <p className="sub">Clean metadata, JSON‑LD, sitemap/robots and tasteful ad slots.</p>
        </div>
      </div>
    </section>
  );
}
