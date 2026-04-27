export default function Home() {
  return (
    <div className="bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 sm:px-6 sm:py-14 lg:py-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-12 lg:py-14">
            <div className="max-w-3xl lg:flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                Day 17 deployment practice
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Building my full-stack skills with Next.js, GitHub, VS Code,
                and AI tools.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">
                This landing page is part of my hands-on learning journey. I am
                practicing how to turn a starter project into something that
                feels clear, modern, and real one step at a time.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:w-auto"
                  href="https://nextjs.org/learn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue the Next.js journey
                </a>
                <a
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50 sm:w-auto"
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Track progress on GitHub
                </a>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900 sm:p-6 lg:max-w-sm lg:self-stretch">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Current focus
                </p>
                <p className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-200">
                  Turning a simple homepage into a polished landing page without
                  adding extra complexity.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Stack
                  </p>
                  <p className="mt-2">Next.js + Tailwind</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    Workflow
                  </p>
                  <p className="mt-2">Plan, build, refine</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-200 bg-white px-5 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A learning workflow built around steady progress.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Each section of this project reflects how I am approaching
              full-stack development: learning by doing, using tools
              thoughtfully, and keeping visible progress as I go.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Learn by Building
              </p>
              <h3 className="mt-4 text-xl font-semibold">Small projects, real practice</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                I am learning faster by turning each roadmap day into something
                tangible, from starter pages to more complete UI sections.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                AI-Assisted Workflow
              </p>
              <h3 className="mt-4 text-xl font-semibold">Plan first, then build with support</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                I use AI coding tools to clarify steps, speed up iteration, and
                stay focused while still understanding what I am building.
              </p>
            </article>

            <article className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                GitHub Progress
              </p>
              <h3 className="mt-4 text-xl font-semibold">Visible improvement over time</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                Each commit helps document what I learned, what changed, and how
                this full-stack journey is growing week by week.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-[2rem] bg-zinc-900 px-5 py-8 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600">
                Keep going
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                One polished page at a time is still real progress.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300 dark:text-zinc-700">
                The goal is not to build everything at once. The goal is to keep
                shipping small improvements and keep moving forward through the
                roadmap.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <a
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-700 sm:w-auto"
                href="https://vercel.com/docs/frameworks/nextjs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Next.js deployment guide
              </a>
            </div>
          </div>
        </section>

        <footer className="px-4 pb-2 pt-1 text-center text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:px-6">
          <p>Day 19 Diff Review Practice</p>
          <p className="text-zinc-400 dark:text-zinc-500">
            Full-Stack Roadmap Project
          </p>
        </footer>
      </main>
    </div>
  );
}
