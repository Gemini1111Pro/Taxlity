import "./globals.css";
import Link from "next/link";
import Consent from "@/components/Consent";

export const metadata = {
  title: "Taxlity – Salary & Freelance Tax Calculators",
  description: "Multi-country, federal-only tax calculators with local currency and FY selector.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Taxlity</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/salary">Salary</Link>
              <Link href="/freelancer">Freelancer</Link>
              <Link href="/sources">Sources</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-10">
          <div className="container py-6 text-sm text-gray-600">
            © {new Date().getFullYear()} Taxlity — Educational only. Not tax or legal advice.
          </div>
        </footer>
        <Consent/>
      </body>
    </html>
  );
}
