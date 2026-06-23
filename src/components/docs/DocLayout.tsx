import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

interface DocLayoutProps {
  title: string;
  updated?: string;
  children: React.ReactNode;
}

export function DocLayout({ title, updated, children }: DocLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <article className="mx-auto max-w-2xl px-6 pt-32 pb-24">
        <Link
          href="/"
          className="text-sm text-neutral-400 transition-colors hover:text-neutral-900"
        >
          ← Back to home
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-sm text-neutral-400">
            Updated: {updated}
          </p>
        )}
        <div className="prose-docs mt-10 space-y-6 text-neutral-600">{children}</div>
      </article>
    </main>
  );
}
