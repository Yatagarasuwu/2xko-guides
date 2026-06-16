import Link from "next/link";

import { guideDirectory } from "../../data/mockGuides";

export default function GuidesIndexPage() {
  const officialGuides = guideDirectory.filter(
    (guide) => guide.category === "official",
  );
  const communityGuides = guideDirectory.filter(
    (guide) => guide.category === "community",
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_34%),linear-gradient(180deg,_#040816_0%,_#02030a_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            Guide library
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Official and community guides in one place.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            This library is the front door for curated guides, community
            submissions, and future QA review. Pick a team, then open the
            workspace to branch into combos, mixups, okizeme, and neutral.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/champions"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Build a team
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
            >
              Back home
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">
                Official guides
              </h2>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                Curated
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {officialGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  className="block rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                        Official
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {guide.summary}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                      {guide.recordings} recordings
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">
                Community guides
              </h2>
              <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs font-medium text-fuchsia-100">
                Submitted
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {communityGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.id}`}
                  className="block rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-200/70">
                        Community
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {guide.summary}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                      {guide.author}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}