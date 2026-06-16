import Link from "next/link";

import { guideDirectory } from "../data/mockGuides";

export default function Home() {
  const featuredGuides = guideDirectory;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.14),_transparent_30%),radial-gradient(circle_at_right,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(180deg,_#050816_0%,_#02030a_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              2XKO guide forge
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build a two-character team guide that can branch across combos,
              mixups, okizeme, and neutral.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Start with a pair, then add recordings and route labels for every
              concept. The page structure is built to support official guides,
              community submissions, and future QA review.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/champions"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Choose a team
              </Link>
              <Link
                href="/guides"
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
              >
                Browse guides
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [
                  "Combos",
                  "Starter-based routes with best oki, cashout, and assist options.",
                ],
                [
                  "Mixups",
                  "Branching trees that show every response and each recording.",
                ],
                [
                  "QA ready",
                  "A path toward moderated user submissions and bot-friendly video links.",
                ],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4"
                >
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2.5rem] border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">
              Concept overview
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Official guides</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Curated team pages with verified routes and recordings.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Community guides</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  User-published submissions that can be reviewed before promotion.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Discord bot target</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Each guide is structured so a bot can surface a specific recording in chat.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">Featured guides</h2>
              <Link href="/guides" className="text-sm text-cyan-200 transition hover:text-cyan-100">
                View all
              </Link>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  <p
                    className={`text-xs uppercase tracking-[0.3em] ${
                      guide.category === "official"
                        ? "text-cyan-200/70"
                        : "text-fuchsia-200/70"
                    }`}
                  >
                    {guide.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {guide.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">The editing model</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Pick a pair</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Use the team builder to lock in a duo and open its guide workspace.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Branch concepts</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Switch between combos, mixups, okizeme, and neutral without leaving the page.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Show recordings</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Label every branch with a video reference so players can learn by example.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Publish responsibly</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Keep official content curated and review community submissions before promotion.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}