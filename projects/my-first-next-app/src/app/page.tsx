import Link from "next/link";
import Header from "./Header";

export default function Home() {
  const name = "Mahmoud";
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-12">
      <nav className="flex gap-4 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/learning">Learning</Link>
      </nav>

      <section className="space-y-4">
        <Header title="Home Page" />
        <h1 className="text-3xl font-bold">
  Welcome {name} — my first Next.js app 🚀
</h1>
        <p className="text-base text-gray-700">
          Welcome to Day 9 of your Next.js app. This is the home page.
        </p>
        <p className="text-base text-gray-700">
          Use the links above to visit the About and Learning pages.
        </p>
      </section>
    </main>
  );
}
