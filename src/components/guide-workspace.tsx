"use client";

import Link from "next/link";
import { useState } from "react";

import type { TeamGuide } from "../data/mockGuides";

type ConceptKey = keyof TeamGuide["concepts"];

const conceptLabels: Record<ConceptKey, { label: string; description: string }> = {
  combos: {
    label: "Combos",
    description: "Starter-based routes with the right ender for the job.",
  },
  mixups: {
    label: "Mixups",
    description: "Branching pressure trees with every answer shown.",
  },
  okizeme: {
    label: "Okizeme",
    description: "What the team gets off specific knockdown states.",
  },
  neutral: {
    label: "Neutral",
    description: "The team plan before the first clean hit lands.",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");
}

function BranchTree({
  label,
  description,
  recording,
  branches,
  depth = 0,
}: TeamGuide["concepts"]["mixups"]["tree"] & { depth?: number }) {
  return (
    <div className={depth > 0 ? "ml-6 border-l border-white/10 pl-4" : ""}>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 shadow-lg shadow-black/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          </div>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
            {recording}
          </span>
        </div>
      </div>

      {branches?.length ? (
        <div className="mt-4 space-y-4">
          {branches.map((branch) => (
            <BranchTree key={branch.label} {...branch} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function GuideWorkspace({ guide }: { guide: TeamGuide }) {
  const [activeConcept, setActiveConcept] = useState<ConceptKey>("combos");

  const activeConceptLabel = conceptLabels[activeConcept];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.16),_transparent_28%),linear-gradient(180deg,_#050816_0%,_#02040a_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${
                  guide.category === "official"
                    ? "bg-cyan-300/10 text-cyan-100"
                    : "bg-fuchsia-300/10 text-fuchsia-100"
                }`}
              >
                {guide.category}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {guide.recordings} recordings
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {guide.published}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
                  Team guide workspace
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {guide.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  {guide.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {guide.team.map((champion) => (
                  <div
                    key={champion}
                    className="rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 text-left"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
                      Slot
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 text-sm font-semibold text-white">
                        {initials(champion)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{champion}</p>
                        <p className="text-xs text-slate-400">Selected</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {(Object.keys(conceptLabels) as ConceptKey[]).map((key) => {
                const selected = key === activeConcept;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveConcept(key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-white text-slate-950"
                        : "border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/8"
                    }`}
                  >
                    {conceptLabels[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2.25rem] border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Guide controls
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Current concept</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {activeConceptLabel.description}
                    </p>
                  </div>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    {activeConceptLabel.label}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Publishing lane</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Official guides are curated routes. Community guides are published submissions. Drafts can be used as a working sandbox until a route is reviewed.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Path to QA</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>Record every branch with a stable label.</li>
                  <li>Mark the hit state, meter spend, and assist requirement.</li>
                  <li>Review user submissions before promoting them to official status.</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-fuchsia-400/10 p-4">
                <p className="text-sm font-semibold text-white">Navigation</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link
                    href="/"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Home
                  </Link>
                  <Link
                    href="/champions"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Team builder
                  </Link>
                  <Link
                    href="/guides"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Guide library
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            {activeConcept === "combos" ? (
              <div className="space-y-4">
                {guide.concepts.combos.map((combo) => (
                  <article
                    key={combo.starter}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                          Combo path
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                          {combo.starter}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">{combo.route}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-slate-300">
                        {combo.focus}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {combo.variants.map((variant) => (
                        <div
                          key={variant.label}
                          className="rounded-[1.35rem] border border-white/10 bg-black/30 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-white">
                              {variant.label}
                            </p>
                            <span className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-400">
                              Recording
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            {variant.payoff}
                          </p>
                          <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-50">
                            {variant.recording}
                          </p>
                        </div>
                      ))}
                    </div>

                    <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                      {combo.notes.map((note) => (
                        <li
                          key={note}
                          className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : null}

            {activeConcept === "mixups" ? (
              <div className="space-y-5">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">
                    Sequence start
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {guide.concepts.mixups.opening}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {guide.concepts.mixups.setup}
                  </p>
                </div>

                <BranchTree {...guide.concepts.mixups.tree} />
              </div>
            ) : null}

            {activeConcept === "okizeme" ? (
              <div className="grid gap-4">
                {guide.concepts.okizeme.map((oki) => (
                  <article
                    key={oki.hitState}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                          Knockdown state
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                          {oki.hitState}
                        </h2>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-slate-300">
                        Oki focus
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/30 p-4">
                        <p className="text-sm font-semibold text-white">Solo</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {oki.soloOption}
                        </p>
                      </div>
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/30 p-4">
                        <p className="text-sm font-semibold text-white">
                          With assist
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {oki.assistOption}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-50">
                      {oki.recording}
                    </p>
                  </article>
                ))}
              </div>
            ) : null}

            {activeConcept === "neutral" ? (
              <div className="grid gap-4">
                {guide.concepts.neutral.map((neutral) => (
                  <article
                    key={neutral.title}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
                          Neutral concept
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                          {neutral.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {neutral.summary}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-slate-300">
                        Gameplan note
                      </span>
                    </div>

                    <ul className="mt-4 grid gap-2 md:grid-cols-2">
                      {neutral.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm leading-6 text-slate-300"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-50">
                      {neutral.recording}
                    </p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="rounded-[2.25rem] border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Concept summary
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">
                  How the page is meant to work
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Each guide can swap between combo routes, branching mixups, knockdown routes, and neutral notes without leaving the page. The recordings are the anchor for every branch.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Status model</p>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <p>Official guide: trusted curated route.</p>
                  <p>Community guide: published submission.</p>
                  <p>Draft guide: team-specific workspace before review.</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Path to QA</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  <li>Record every branch with a stable label.</li>
                  <li>Mark the hit state, meter spend, and assist requirement.</li>
                  <li>
                    Review user submissions before promoting them to official status.
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-fuchsia-400/10 p-4">
                <p className="text-sm font-semibold text-white">Navigation</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link
                    href="/"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Home
                  </Link>
                  <Link
                    href="/champions"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Team builder
                  </Link>
                  <Link
                    href="/guides"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Guide library
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}