export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="w-full max-w-3xl rounded-3xl bg-white px-8 py-12 shadow-sm dark:bg-zinc-950 sm:px-12">
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-5 text-center sm:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Learning project
            </p>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Build your Next.js skills one small step at a time.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                This starter homepage is being turned into a simple landing page
                as part of a full-stack learning roadmap.
              </p>
            </div>
            <div>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                href="https://nextjs.org/learn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Continue Learning
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Today&apos;s focus
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Replace the default starter content with a clean hero section and
              a small supporting block that feels more like a real homepage.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
