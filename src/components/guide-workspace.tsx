"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { TeamGuide } from "../data/mockGuides";

type RecordingKind = "youtube" | "mp4" | "upload" | "link";

type RecordingEntry = {
  id: string;
  title: string;
  kind: RecordingKind;
  source: string;
  notes: string;
  fileName?: string;
};

type MixupBranch = {
  id: string;
  label: string;
  notes: string;
  recordingId: string | null;
  next: MixupStep | null;
};

type MixupStep = {
  id: string;
  label: string;
  notes: string;
  recordingId: string | null;
  next: MixupStep | null;
  branches: MixupBranch[];
};

type DraftGuide = {
  title: string;
  summary: string;
  team: string[];
  recordings: RecordingEntry[];
  tree: MixupStep;
};

type GuideMixupTree = TeamGuide["concepts"]["mixups"]["tree"];
type GuideMixupBranch = NonNullable<GuideMixupTree["branches"]>[number];

type StepId = "basics" | "recordings" | "tree" | "review";

type RecordingFormState = {
  title: string;
  kind: RecordingKind;
  source: string;
  notes: string;
  fileName: string;
};

type StepFormState = {
  title: string;
  notes: string;
};

type WorkspaceMode = "view" | "edit";

const stepLabels: Array<{
  id: StepId;
  label: string;
  description: string;
}> = [
  {
    id: "basics",
    label: "Basics",
    description: "Title, summary, and team identity.",
  },
  {
    id: "recordings",
    label: "Recordings",
    description: "Add links, mp4 files, or uploads.",
  },
  {
    id: "tree",
    label: "Mixup tree",
    description: "Branch the pressure route wherever the mixup starts.",
  },
  {
    id: "review",
    label: "Review",
    description: "Check the draft before you publish it.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTitle(text: string, fallback: string) {
  const cleaned = text.trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

function sortByLabel<T extends { label: string }>(items: T[]) {
  return [...items].sort((left, right) => left.label.localeCompare(right.label));
}

function MediaFrame({
  title,
  recording,
  videoUrl,
}: {
  title: string;
  recording: string;
  videoUrl?: string;
}) {
  if (videoUrl) {
    return (
      <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/40">
        <video className="aspect-video w-full bg-black object-cover" controls src={videoUrl} />
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
            {recording}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.35rem] border border-dashed border-white/15 bg-black/30 p-4">
      <div className="flex aspect-video items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.03] text-center">
        <div>
          <p className="text-sm font-semibold text-white">No video attached</p>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-400">
            {recording}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-200">{title}</p>
    </div>
  );
}

function ViewerTreeNode({
  node,
  depth = 0,
}: {
  node: TeamGuide["concepts"]["mixups"]["tree"];
  depth?: number;
}) {
  const branches = sortByLabel(node.branches ?? []);

  return (
    <div className={depth > 0 ? "ml-5 border-l border-white/10 pl-5" : ""}>
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-fuchsia-200/70">
              Mixup node
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{node.label}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{node.description}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
            {branches.length} branches
          </span>
        </div>

        <div className="mt-4">
          <MediaFrame title={node.label} recording={node.recording} videoUrl={node.videoUrl} />
        </div>
      </div>

      {branches.length > 0 ? (
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {branches.map((branch) => (
            <div key={`${node.label}-${branch.label}`} className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cyan-200/70">
                  Branch option
                </p>
                <h4 className="mt-2 text-lg font-semibold text-white">{branch.label}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{branch.description}</p>
              </div>
              <MediaFrame title={branch.label} recording={branch.recording} videoUrl={branch.videoUrl} />
              {branch.branches?.length ? <ViewerTreeNode node={branch} depth={depth + 1} /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function GuideViewerWorkspace({ guide }: { guide: TeamGuide }) {
  const combos = [...guide.concepts.combos].sort((left, right) =>
    left.starter.localeCompare(right.starter),
  );
  const mixupTree = guide.concepts.mixups.tree;
  const comboCount = combos.length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.14),_transparent_30%),linear-gradient(180deg,_#050816_0%,_#02040a_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
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
                {guide.published}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {guide.recordings} recordings
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {comboCount} combos
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
                  Guide viewer
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

            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <Link
                href={`${guide.id === "sample-complete-guide" ? "/guides/sample-complete-guide" : `/guides/${guide.id}`}?mode=edit`}
                className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Open builder
              </Link>
              <Link
                href="/guides"
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-medium text-slate-200 transition hover:bg-white/[0.08]"
              >
                Back to library
              </Link>
            </div>
          </div>

          <aside className="rounded-[2.25rem] border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              At a glance
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Reading mode</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Combos are sorted by starter, and mixups are shown as a clean recursive tree with each branch clearly separated.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Media display</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Video clips render inline when a guide has a `videoUrl`. If a route does not have one, the viewer shows a blank placeholder box instead.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-fuchsia-400/10 p-4">
                <p className="text-sm font-semibold text-white">Mode switch</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-50">
                    Viewer active
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200">
                    Builder available
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">
                Combos
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-white">Sorted by starter</h2>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                  {comboCount} routes
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                {combos.map((combo) => {
                  const variants = sortByLabel(combo.variants);

                  return (
                    <article
                      key={combo.starter}
                      className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                            Combo starter
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold text-white">
                            {combo.starter}
                          </h3>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            {combo.route}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-slate-300">
                          {combo.focus}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-3">
                        {variants.map((variant) => (
                          <div key={variant.label} className="space-y-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                            <div>
                              <p className="text-sm font-semibold text-white">{variant.label}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">
                                {variant.payoff}
                              </p>
                            </div>
                            <MediaFrame
                              title={variant.label}
                              recording={variant.recording}
                              videoUrl={variant.videoUrl}
                            />
                          </div>
                        ))}
                      </div>

                      <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                        {combo.notes.map((note) => (
                          <li key={note} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6 rounded-[2.25rem] border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">
                Mixup tree
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Branching pressure</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The tree is rendered from the current root outward so each branch stays easy to follow.
              </p>
            </div>

            <ViewerTreeNode node={mixupTree} />
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
              Okizeme
            </p>
            <div className="mt-4 grid gap-4">
              {guide.concepts.okizeme.map((oki) => (
                <div key={oki.hitState} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{oki.hitState}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{oki.soloOption}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{oki.assistOption}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <MediaFrame title={oki.hitState} recording={oki.recording} videoUrl={oki.videoUrl} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
              Neutral
            </p>
            <div className="mt-4 grid gap-4">
              {guide.concepts.neutral.map((neutral) => (
                <div key={neutral.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">{neutral.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{neutral.summary}</p>
                  <ul className="mt-3 grid gap-2 md:grid-cols-2">
                    {neutral.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm leading-6 text-slate-300">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <MediaFrame title={neutral.title} recording={neutral.recording} videoUrl={neutral.videoUrl} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function updateStep(
  step: MixupStep,
  stepId: string,
  updater: (step: MixupStep) => MixupStep,
): MixupStep {
  if (step.id === stepId) {
    return updater(step);
  }

  return {
    ...step,
    next: step.next ? updateStep(step.next, stepId, updater) : null,
    branches: step.branches.map((branch) => ({
      ...branch,
      next: branch.next ? updateStep(branch.next, stepId, updater) : null,
    })),
  };
}

function updateBranch(
  step: MixupStep,
  branchId: string,
  updater: (branch: MixupBranch) => MixupBranch,
): MixupStep {
  return {
    ...step,
    next: step.next ? updateBranch(step.next, branchId, updater) : null,
    branches: step.branches.map((branch) =>
      branch.id === branchId
        ? updater(branch)
        : {
            ...branch,
            next: branch.next ? updateBranch(branch.next, branchId, updater) : null,
          },
    ),
  };
}

function appendLinearStep(current: MixupStep, createdStep: MixupStep): MixupStep {
  if (!current.next) {
    return {
      ...current,
      next: createdStep,
    };
  }

  return {
    ...current,
    next: appendLinearStep(current.next, createdStep),
  };
}

function createStep(seed?: Partial<MixupStep>): MixupStep {
  return {
    id: seed?.id ?? createId("step"),
    label: seed?.label ?? "New step",
    notes: seed?.notes ?? "Describe the route or decision point.",
    recordingId: seed?.recordingId ?? null,
    next: seed?.next ?? null,
    branches: seed?.branches ?? [],
  };
}

function createBranch(seed?: Partial<MixupBranch>): MixupBranch {
  return {
    id: seed?.id ?? createId("branch"),
    label: seed?.label ?? "New option",
    notes: seed?.notes ?? "Describe what this choice covers.",
    recordingId: seed?.recordingId ?? null,
    next: seed?.next ?? null,
  };
}

function buildRecordingSeed(guide: TeamGuide): RecordingEntry[] {
  const seen = new Map<string, string>();
  const items: RecordingEntry[] = [];

  function add(title: string, source: string, notes: string) {
    const key = `${title}|${source}`;
    if (seen.has(key)) {
      return seen.get(key) as string;
    }

    const id = createId("recording");
    seen.set(key, id);
    items.push({
      id,
      title,
      kind: "link",
      source,
      notes,
    });

    return id;
  }

  function walkBranch(branch: GuideMixupBranch) {
    add(branch.label, branch.recording, branch.description);
    branch.branches?.forEach(walkBranch);
  }

  add(guide.concepts.mixups.opening, guide.concepts.mixups.tree.recording, guide.concepts.mixups.setup);
  add(
    guide.concepts.mixups.tree.label,
    guide.concepts.mixups.tree.recording,
    guide.concepts.mixups.tree.description,
  );
  (guide.concepts.mixups.tree.branches ?? []).forEach(walkBranch);

  return items;
}

function buildTreeSeed(guide: TeamGuide, recordings: RecordingEntry[]): MixupStep {
  const recordingBySource = new Map(recordings.map((recording) => [recording.source, recording.id]));
  const decisionPoint = guide.concepts.mixups.tree;

  function seedBranch(branch: GuideMixupBranch): MixupBranch {
    const childStep = createStep({
      label: `After ${branch.label}`,
      notes: branch.description,
      recordingId: recordingBySource.get(branch.recording) ?? null,
      branches: (branch.branches ?? []).map(seedBranch),
    });

    return createBranch({
      label: branch.label,
      notes: branch.description,
      recordingId: recordingBySource.get(branch.recording) ?? null,
      next: childStep,
    });
  }

  return createStep({
    label: "5L",
    notes: guide.concepts.mixups.opening,
    recordingId: recordingBySource.get(decisionPoint.recording) ?? null,
    next: createStep({
      label: "5M",
      notes: guide.concepts.mixups.setup,
      recordingId: recordingBySource.get(decisionPoint.recording) ?? null,
      next: createStep({
        label: decisionPoint.label,
        notes: decisionPoint.description,
        recordingId: recordingBySource.get(decisionPoint.recording) ?? null,
        branches: (decisionPoint.branches ?? []).map(seedBranch),
      }),
    }),
  });
}

function createInitialDraft(guide: TeamGuide): DraftGuide {
  const recordings = buildRecordingSeed(guide);

  return {
    title: guide.title,
    summary: guide.summary,
    team: [...guide.team],
    recordings,
    tree: buildTreeSeed(guide, recordings),
  };
}

function countTree(step: MixupStep): { steps: number; branches: number } {
  let steps = 1;
  let branches = step.branches.length;

  if (step.next) {
    const downstream = countTree(step.next);
    steps += downstream.steps;
    branches += downstream.branches;
  }

  step.branches.forEach((branch) => {
    if (branch.next) {
      const downstream = countTree(branch.next);
      steps += downstream.steps;
      branches += downstream.branches;
    }
  });

  return { steps, branches };
}

function RecordingPreview({ recording }: { recording?: RecordingEntry }) {
  if (!recording) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
        Pick a recording to preview it here.
      </div>
    );
  }

  if (recording.kind === "youtube") {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">YouTube</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{recording.notes}</p>
        <a
          href={recording.source}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-50 transition hover:bg-cyan-300/15"
        >
          Open video
        </a>
      </div>
    );
  }

  if (recording.kind === "mp4" || recording.kind === "upload") {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">MP4 preview</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{recording.notes}</p>
        <video
          className="mt-3 w-full rounded-2xl border border-white/10 bg-black"
          controls
          src={recording.source}
        />
        {recording.fileName ? (
          <p className="mt-3 text-xs uppercase tracking-[0.28em] text-slate-400">
            {recording.fileName}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-white">External link</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{recording.notes}</p>
      <a
        href={recording.source}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-black/35"
      >
        Open source
      </a>
    </div>
  );
}

function MixupStepCard({
  step,
  recordings,
  depth = 0,
  onStepChange,
  onAddNext,
  onAddBranch,
  onAddBranchNext,
  onBranchChange,
}: {
  step: MixupStep;
  recordings: RecordingEntry[];
  depth?: number;
  onStepChange: (stepId: string, updater: (step: MixupStep) => MixupStep) => void;
  onAddNext: (stepId: string) => void;
  onAddBranch: (stepId: string) => void;
  onAddBranchNext: (branchId: string) => void;
  onBranchChange: (branchId: string, updater: (branch: MixupBranch) => MixupBranch) => void;
}) {
  return (
    <div className={depth > 0 ? "ml-5 border-l border-white/10 pl-5" : ""}>
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cyan-200/70">
              Step {depth + 1}
            </p>
            <input
              value={step.label}
              onChange={(event) =>
                onStepChange(step.id, (current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xl font-semibold text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-300/30"
            />
          </div>

          <div className="min-w-[15rem] max-w-xs rounded-2xl border border-white/10 bg-black/25 px-3 py-2">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">
              Recording
            </p>
            <select
              value={step.recordingId ?? ""}
              onChange={(event) =>
                onStepChange(step.id, (current) => ({
                  ...current,
                  recordingId: event.target.value || null,
                }))
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              <option value="">Choose a recording</option>
              {recordings.map((recording) => (
                <option key={recording.id} value={recording.id}>
                  {recording.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={step.notes}
          onChange={(event) =>
            onStepChange(step.id, (current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          className="mt-4 min-h-[5rem] w-full rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
          placeholder="Describe the step, hit confirm, or reset point."
        />

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => onAddNext(step.id)}
            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-50 transition hover:bg-cyan-300/15"
          >
            {step.next ? "Extend chain" : "Add next step"}
          </button>
          <button
            type="button"
            onClick={() => onAddBranch(step.id)}
            className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1.5 text-fuchsia-50 transition hover:bg-fuchsia-300/15"
          >
            Add branch choice
          </button>
        </div>

        <div className="mt-4">
          <RecordingPreview recording={recordings.find((recording) => recording.id === step.recordingId)} />
        </div>
      </div>

      {step.next ? (
        <div className="mt-4">
          <MixupStepCard
            step={step.next}
            recordings={recordings}
            depth={depth + 1}
            onStepChange={onStepChange}
            onAddNext={onAddNext}
            onAddBranch={onAddBranch}
            onAddBranchNext={onAddBranchNext}
            onBranchChange={onBranchChange}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/10 bg-black/15 p-4 text-sm text-slate-400">
          This is where the rest of the string goes after this step.
        </div>
      )}

      {step.branches.length > 0 ? (
        <div className="mt-4 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">
            Branches
          </p>
          {step.branches.map((branch) => (
            <MixupBranchCard
              key={branch.id}
              branch={branch}
              recordings={recordings}
              depth={depth + 1}
              onBranchChange={onBranchChange}
              onAddBranchNext={onAddBranchNext}
              onStepChange={onStepChange}
              onAddNext={onAddNext}
              onAddBranch={onAddBranch}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MixupBranchCard({
  branch,
  recordings,
  depth = 0,
  onBranchChange,
  onAddBranchNext,
  onStepChange,
  onAddNext,
  onAddBranch,
}: {
  branch: MixupBranch;
  recordings: RecordingEntry[];
  depth?: number;
  onBranchChange: (branchId: string, updater: (branch: MixupBranch) => MixupBranch) => void;
  onAddBranchNext: (branchId: string) => void;
  onStepChange: (stepId: string, updater: (step: MixupStep) => MixupStep) => void;
  onAddNext: (stepId: string) => void;
  onAddBranch: (stepId: string) => void;
}) {
  return (
    <div className={depth > 0 ? "ml-5 border-l border-fuchsia-400/15 pl-5" : ""}>
      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-fuchsia-200/70">
              Choice
            </p>
            <input
              value={branch.label}
              onChange={(event) =>
                onBranchChange(branch.id, (current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-lg font-semibold text-white outline-none focus:border-fuchsia-300/30"
            />
          </div>

          <div className="min-w-[14rem] max-w-xs rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">
              Recording
            </p>
            <select
              value={branch.recordingId ?? ""}
              onChange={(event) =>
                onBranchChange(branch.id, (current) => ({
                  ...current,
                  recordingId: event.target.value || null,
                }))
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              <option value="">Choose a recording</option>
              {recordings.map((recording) => (
                <option key={recording.id} value={recording.id}>
                  {recording.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={branch.notes}
          onChange={(event) =>
            onBranchChange(branch.id, (current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          className="mt-4 min-h-[4.5rem] w-full rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-500 focus:border-fuchsia-300/30"
          placeholder="Explain the branch answer."
        />

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => onAddBranchNext(branch.id)}
            className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1.5 text-fuchsia-50 transition hover:bg-fuchsia-300/15"
          >
            {branch.next ? "Extend follow-up" : "Add follow-up step"}
          </button>
        </div>

        <div className="mt-4">
          <RecordingPreview recording={recordings.find((recording) => recording.id === branch.recordingId)} />
        </div>
      </div>

      {branch.next ? (
        <div className="mt-4">
          <MixupStepCard
            step={branch.next}
            recordings={recordings}
            depth={depth + 1}
            onStepChange={onStepChange}
            onAddNext={onAddNext}
            onAddBranch={onAddBranch}
            onAddBranchNext={onAddBranchNext}
            onBranchChange={onBranchChange}
          />
        </div>
      ) : (
        <div className="mt-4 rounded-[1.5rem] border border-dashed border-fuchsia-300/15 bg-black/15 p-4 text-sm text-slate-400">
          Add the rest of the branch after the choice lands.
        </div>
      )}
    </div>
  );
}

export function GuideWorkspace({
  guide,
  mode = "view",
}: {
  guide: TeamGuide;
  mode?: WorkspaceMode;
}) {
  if (mode === "view") {
    return <GuideViewerWorkspace guide={guide} />;
  }

  const storageKey = `2xko-guide-draft:${guide.id}`;
  const [activeStep, setActiveStep] = useState<StepId>("basics");
  const [draft, setDraft] = useState<DraftGuide>(() => {
    if (typeof window === "undefined") {
      return createInitialDraft(guide);
    }

    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return createInitialDraft(guide);
    }

    try {
      const parsed = JSON.parse(stored) as DraftGuide;
      if (parsed && parsed.title && parsed.tree) {
        return parsed;
      }
    } catch {
      // Fall back to the seeded draft when the saved state cannot be parsed.
    }

    return createInitialDraft(guide);
  });
  const [recordingForm, setRecordingForm] = useState<RecordingFormState>({
    title: "",
    kind: "youtube",
    source: "",
    notes: "",
    fileName: "",
  });
  const [stepForm, setStepForm] = useState<StepFormState>({
    title: "5L",
    notes: "Open with the starter and pick where the route branches.",
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, storageKey]);

  const counts = useMemo(() => countTree(draft.tree), [draft.tree]);
  const activeRecording = draft.recordings.find((recording) => recording.id === draft.tree.recordingId);

  function addRecording() {
    const title = normalizeTitle(recordingForm.title, `Recording ${draft.recordings.length + 1}`);
    const nextRecording: RecordingEntry = {
      id: createId("recording"),
      title,
      kind: recordingForm.kind,
      source: recordingForm.source,
      notes: recordingForm.notes,
      fileName: recordingForm.fileName || undefined,
    };

    setDraft((current) => ({
      ...current,
      recordings: [nextRecording, ...current.recordings],
    }));

    setRecordingForm({
      title: "",
      kind: "youtube",
      source: "",
      notes: "",
      fileName: "",
    });
  }

  async function handleUpload(file: File | null) {
    if (!file) {
      return;
    }

    const previewUrl = await readFileAsDataUrl(file);

    setRecordingForm((current) => ({
      ...current,
      kind: "upload",
      source: previewUrl,
      fileName: file.name,
      title: current.title || file.name,
    }));
  }

  function createFollowupStep(parentLabel: string) {
    return createStep({
      label: `${parentLabel} follow-up`,
      notes: "Continue the route after this decision.",
      recordingId: draft.recordings[0]?.id ?? null,
    });
  }

  function handleAddNext(stepId: string) {
    setDraft((current) => ({
      ...current,
      tree: updateStep(current.tree, stepId, (step) => ({
        ...step,
        next: step.next ? appendLinearStep(step.next, createFollowupStep(step.label)) : createFollowupStep(step.label),
      })),
    }));
  }

  function handleAddBranch(stepId: string) {
    setDraft((current) => ({
      ...current,
      tree: updateStep(current.tree, stepId, (step) => ({
        ...step,
        branches: [...step.branches, createBranch({ recordingId: current.recordings[0]?.id ?? null })],
      })),
    }));
  }

  function handleAddBranchNext(branchId: string) {
    setDraft((current) => ({
      ...current,
      tree: updateBranch(current.tree, branchId, (branch) => ({
        ...branch,
        next: branch.next ? appendLinearStep(branch.next, createFollowupStep(branch.label)) : createFollowupStep(branch.label),
      })),
    }));
  }

  function handleStepChange(stepId: string, updater: (step: MixupStep) => MixupStep) {
    setDraft((current) => ({
      ...current,
      tree: updateStep(current.tree, stepId, updater),
    }));
  }

  function handleBranchChange(branchId: string, updater: (branch: MixupBranch) => MixupBranch) {
    setDraft((current) => ({
      ...current,
      tree: updateBranch(current.tree, branchId, updater),
    }));
  }

  function applyStarterFromForm() {
    const starter = normalizeTitle(stepForm.title, "5L");

    setDraft((current) => ({
      ...current,
      tree: createStep({
        label: starter,
        notes: stepForm.notes,
        recordingId: current.recordings[0]?.id ?? null,
        next: createStep({
          label: "5M",
          notes: "Add the next beat in the sequence.",
          recordingId: current.recordings[0]?.id ?? null,
          next: createStep({
            label: "assist call",
            notes: "Place the decision point here and branch into high/low.",
            recordingId: current.recordings[0]?.id ?? null,
            branches: [
              createBranch({
                label: "high",
                notes: "Overhead branch.",
                recordingId: current.recordings[0]?.id ?? null,
                next: createStep({
                  label: "after high",
                  notes: "Continue after the high lands.",
                  recordingId: current.recordings[0]?.id ?? null,
                }),
              }),
              createBranch({
                label: "low",
                notes: "Low branch.",
                recordingId: current.recordings[0]?.id ?? null,
                next: createStep({
                  label: "after low",
                  notes: "Continue after the low lands.",
                  recordingId: current.recordings[0]?.id ?? null,
                }),
              }),
            ],
          }),
        }),
      }),
    }));
  }

  const heroTag = guide.category === "official" ? "bg-cyan-300/10 text-cyan-100" : "bg-fuchsia-300/10 text-fuchsia-100";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.14),_transparent_30%),linear-gradient(180deg,_#050816_0%,_#02040a_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${heroTag}`}>
                {guide.category}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {guide.published}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {draft.recordings.length} recordings in draft
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                {counts.steps} steps, {counts.branches} branches
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/70">
                  Step-by-step guide builder
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {draft.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Build the guide in layers: set the basics, add recordings, then fork the mixup tree from any step or choice.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {draft.team.map((champion) => (
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

            <div className="mt-6 grid gap-2 sm:grid-cols-4">
              {stepLabels.map((step, index) => {
                const selected = step.id === activeStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`rounded-[1.4rem] border px-4 py-3 text-left transition ${
                      selected
                        ? "border-white/20 bg-white text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]"
                    }`}
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] opacity-70">
                      {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-semibold">{step.label}</p>
                    <p className={`mt-1 text-xs leading-5 ${selected ? "text-slate-700" : "text-slate-400"}`}>
                      {step.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2.25rem] border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Draft controls
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Current step</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {stepLabels.find((step) => step.id === activeStep)?.description}
                    </p>
                  </div>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    {stepLabels.find((step) => step.id === activeStep)?.label}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Recording support</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Add YouTube links, direct mp4 URLs, external links, or an upload from your machine. The recording list becomes selectable for each tree node.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Branching model</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Every step can continue the linear string or fork into separate choice cards. Each choice can then continue with its own follow-up.
                </p>
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

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            {activeStep === "basics" ? (
              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                    Guide basics
                  </p>
                  <div className="mt-4 grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Title</span>
                      <input
                        value={draft.title}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Summary</span>
                      <textarea
                        value={draft.summary}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            summary: event.target.value,
                          }))
                        }
                        className="min-h-[7rem] rounded-[1.35rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-200 outline-none focus:border-cyan-300/30"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Team</span>
                      <input
                        value={draft.team.join(" / ")}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            team: event.target.value
                              .split("/")
                              .map((entry) => entry.trim())
                              .filter(Boolean),
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                        placeholder="Ahri / Yasuo"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold text-white">What this step does</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Use this panel to set the guide identity before you lock the tree or attach clips.
                  </p>
                </div>
              </div>
            ) : null}

            {activeStep === "recordings" ? (
              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">
                    Add a recording
                  </p>
                  <div className="mt-4 grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Title</span>
                      <input
                        value={recordingForm.title}
                        onChange={(event) =>
                          setRecordingForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-300/30"
                        placeholder="5L -> 5M -> assist call"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Type</span>
                      <select
                        value={recordingForm.kind}
                        onChange={(event) =>
                          setRecordingForm((current) => ({
                            ...current,
                            kind: event.target.value as RecordingKind,
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="mp4">MP4 URL</option>
                        <option value="upload">Upload file</option>
                        <option value="link">External link</option>
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">
                        {recordingForm.kind === "youtube"
                          ? "YouTube URL"
                          : recordingForm.kind === "mp4"
                            ? "MP4 URL"
                            : recordingForm.kind === "upload"
                              ? "Uploaded file preview"
                              : "Link"}
                      </span>
                      <input
                        value={recordingForm.source}
                        onChange={(event) =>
                          setRecordingForm((current) => ({
                            ...current,
                            source: event.target.value,
                          }))
                        }
                        className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-300/30"
                        placeholder={
                          recordingForm.kind === "youtube"
                            ? "https://www.youtube.com/watch?v=..."
                            : recordingForm.kind === "mp4"
                              ? "https://.../clip.mp4"
                              : recordingForm.kind === "upload"
                                ? "Choose a file below"
                                : "https://..."
                        }
                        readOnly={recordingForm.kind === "upload"}
                      />
                    </label>

                    {recordingForm.kind === "upload" ? (
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-white">Upload mp4</span>
                        <input
                          type="file"
                          accept="video/mp4,video/*"
                          onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
                          className="rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                        />
                      </label>
                    ) : null}

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Notes</span>
                      <textarea
                        value={recordingForm.notes}
                        onChange={(event) =>
                          setRecordingForm((current) => ({
                            ...current,
                            notes: event.target.value,
                          }))
                        }
                        className="min-h-[6rem] rounded-[1.35rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-200 outline-none focus:border-fuchsia-300/30"
                        placeholder="Describe what this clip proves."
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={addRecording}
                    className="mt-4 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-50 transition hover:bg-fuchsia-300/15"
                  >
                    Add recording
                  </button>
                </div>

                <div className="grid gap-3">
                  {draft.recordings.map((recording) => (
                    <div key={recording.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{recording.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
                            {recording.kind}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                          {recording.fileName ?? recording.source}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{recording.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeStep === "tree" ? (
              <div className="space-y-5">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
                    Build the string
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-white">Starter label</span>
                        <input
                          value={stepForm.title}
                          onChange={(event) =>
                            setStepForm((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/30"
                          placeholder="5L"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={applyStarterFromForm}
                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/15"
                      >
                        Rebuild starter chain
                      </button>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-white">Starter notes</span>
                      <textarea
                        value={stepForm.notes}
                        onChange={(event) =>
                          setStepForm((current) => ({
                            ...current,
                            notes: event.target.value,
                          }))
                        }
                        className="min-h-[6rem] rounded-[1.35rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-slate-200 outline-none focus:border-cyan-300/30"
                        placeholder="Where does this string begin?"
                      />
                    </label>
                  </div>
                </div>

                <MixupStepCard
                  step={draft.tree}
                  recordings={draft.recordings}
                  onStepChange={handleStepChange}
                  onAddNext={handleAddNext}
                  onAddBranch={handleAddBranch}
                  onAddBranchNext={handleAddBranchNext}
                  onBranchChange={handleBranchChange}
                />
              </div>
            ) : null}

            {activeStep === "review" ? (
              <div className="grid gap-4">
                <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/70">
                    Draft snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{draft.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{draft.summary}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
                      <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">Recordings</span>
                      {draft.recordings.length}
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
                      <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">Steps</span>
                      {counts.steps}
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
                      <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">Branches</span>
                      {counts.branches}
                    </div>
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm font-semibold text-white">Publish checklist</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    <li>Make the starter chain readable from the first step to the first decision.</li>
                    <li>Attach at least one recording to each decision point that matters.</li>
                    <li>Keep the branch labels short so the tree stays usable once it grows.</li>
                    <li>Use YouTube for shared clips, mp4 for direct playback, and uploads for local drafting.</li>
                  </ul>
                </article>

                <RecordingPreview recording={activeRecording} />
              </div>
            ) : null}
          </div>

          <aside className="rounded-[2.25rem] border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Guide summary
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">How the builder works</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Start with the guide basics, attach recordings, then branch the tree at any step or branch. The current draft is saved locally in your browser.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Seed route</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {guide.concepts.mixups.setup}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Recording focus</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Add a video for the opening, another for the decision point, and then one for each branch outcome you want to teach.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-fuchsia-400/10 p-4">
                <p className="text-sm font-semibold text-white">Navigation</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Link
                    href="/guides"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Guide library
                  </Link>
                  <Link
                    href="/champions"
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-slate-200 transition hover:bg-black/35"
                  >
                    Team builder
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