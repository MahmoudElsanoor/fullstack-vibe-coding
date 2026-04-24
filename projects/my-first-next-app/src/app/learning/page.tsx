import Link from "next/link";
import Header from "../Header";
export default function LearningPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-12">
      <nav className="flex gap-4 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/learning">Learning</Link>
      </nav>

      <section className="space-y-4">
        <Header title="Learning Page" />
        <h1 className="text-3xl font-bold">Learning Page</h1>
        <p className="text-base text-gray-700">
          This page can hold notes, lessons, or practice content as you learn
          Next.js.
        </p>
      </section>
    </main>
  );
}
