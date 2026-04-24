import Link from "next/link";
import Header from "../Header";
export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-12">
      <nav className="flex gap-4 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/learning">Learning</Link>
      </nav>

      <section className="space-y-4">
        <Header title="About Page" />
        <h1 className="text-3xl font-bold">About Page</h1>
        <p className="text-base text-gray-700">
          This is the About page for your Next.js practice project.
        </p>
      </section>
    </main>
  );
}
