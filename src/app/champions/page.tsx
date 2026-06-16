"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ahri from "./ahri.png";
import akali from "./akali.png";
import blitzcrank from "./blitzcrank.png";
import braum from "./braum.png";
import caitlyn from "./caitlyn.png";
import darius from "./darius.png";
import ekko from "./ekko.png";
import illaoi from "./illaoi.png";
import jinx from "./jinx.png";
import senna from "./senna.png";
import teemo from "./teemo.png";
import thresh from "./thresh.png";
import vi from "./vi.png";
import warwick from "./warwick.png";
import yasuo from "./yasuo.png";

const champions = [
  { id: "ekko", name: "Ekko", image: ekko },
  { id: "ahri", name: "Ahri", image: ahri },
  { id: "jinx", name: "Jinx", image: jinx },
  { id: "yasuo", name: "Yasuo", image: yasuo },
  { id: "darius", name: "Darius", image: darius },
  { id: "warwick", name: "Warwick", image: warwick },
  { id: "blitzcrank", name: "Blitzcrank", image: blitzcrank },
  { id: "senna", name: "Senna", image: senna },
  { id: "thresh", name: "Thresh", image: thresh },
  { id: "caitlyn", name: "Caitlyn", image: caitlyn },
  { id: "vi", name: "Vi", image: vi },
  { id: "teemo", name: "Teemo", image: teemo },
  { id: "illaoi", name: "Illaoi", image: illaoi },
  { id: "akali", name: "Akali", image: akali },
  { id: "braum", name: "Braum", image: braum },
];

type Champion = {
  id: string;
  name: string;
  image: StaticImageData;
};

export default function ChampionsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  function toggleChampion(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((c) => c !== id));
      return;
    }

    if (selected.length >= 2) return;

    setSelected([...selected, id]);
  }

  const selectedChampions = champions.filter((champion) =>
    selected.includes(champion.id),
  );

  const selectedTeamKey = [...selected].sort().join("-");
  const canRoute = selected.length === 2;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),_transparent_36%),linear-gradient(180deg,_#0b0710_0%,_#040206_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="flex items-center justify-between rounded-[2rem] border border-pink-400/15 bg-white/[0.04] px-6 py-5 shadow-2xl shadow-pink-950/20 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-300">
              Champions
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Choose your two.
            </h1>
          </div>

          <div className="rounded-2xl border border-pink-400/15 bg-black/60 px-4 py-3 text-sm text-slate-300">
            <span className="font-semibold text-white">{selected.length}/2</span>
          </div>
        </section>

        <section className="rounded-[2rem] border border-pink-400/15 bg-black/40 p-4 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="mb-4 flex items-center justify-between px-2 text-sm text-slate-400">
            <span>Chosen champions</span>
            <span>{selectedChampions.length}/2 selected</span>
          </div>

          {selectedChampions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {selectedChampions.map((champion, index) => (
                <article
                  key={champion.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-pink-400/20 bg-[#0b0508] shadow-xl shadow-pink-950/20"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.28),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(0,0,0,0.72)_100%)]" />
                  <div className="relative h-[22rem] sm:h-[26rem]">
                    <div className="absolute inset-0 p-3 sm:p-4">
                      <Image
                        src={champion.image}
                        alt={champion.name}
                        fill
                        priority={index === 0}
                        className="object-contain object-center transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-pink-200/80">
                        Selected champion
                      </p>
                      <h3 className="mt-2 text-3xl font-semibold text-white drop-shadow-md">
                        {champion.name}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-pink-400/15 bg-white/[0.03] px-6 py-10 text-sm leading-6 text-slate-300">
              Pick one champion to feature them here, then choose a second to
              lock in the duo.
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <div className="rounded-[2rem] border border-pink-400/15 bg-black/40 p-4 shadow-xl shadow-black/30 backdrop-blur">
            <div className="mb-4 flex items-center justify-between px-2 text-sm text-slate-400">
              <span>Roster</span>
              <span>{champions.length} champions</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {champions.map((champion) => {
                const isSelected = selected.includes(champion.id);

                return (
                  <button
                    key={champion.id}
                    type="button"
                    onClick={() => toggleChampion(champion.id)}
                    className={`group relative overflow-hidden rounded-[1.75rem] border text-left transition duration-300 hover:-translate-y-1 ${
                      isSelected
                        ? "border-pink-300/80 shadow-lg shadow-pink-500/25"
                        : "border-white/10"
                    } ${
                      isSelected ? "aspect-[0.82/1] bg-white/10" : "aspect-[0.9/1] bg-white/[0.03]"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.03)_0%,_rgba(0,0,0,0.4)_100%)]" />
                    <div className="absolute inset-0 p-1.5">
                      <Image
                        src={champion.image}
                        alt={champion.name}
                        fill
                        className={`object-contain object-center transition duration-300 group-hover:scale-105 ${
                          isSelected ? "scale-[1.03]" : ""
                        }`}
                        sizes="(max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 20vw"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div
                      className={`absolute inset-x-0 bottom-0 p-3 transition duration-300 ${
                        isSelected ? "pb-4" : "pb-3"
                      }`}
                    >
                      <div className="flex items-end justify-between gap-2">
                        <h2 className="text-lg font-semibold text-white drop-shadow-md">
                          {champion.name}
                        </h2>

                        {isSelected ? (
                          <span className="rounded-full border border-pink-300/30 bg-pink-300/10 px-2.5 py-1 text-xs font-medium text-pink-100">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-pink-400/15 bg-black/55 p-5 shadow-xl shadow-black/30 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-pink-300">
                Team status
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Pick up to two
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              {selectedChampions.length > 0 ? (
                selectedChampions.map((champion, index) => (
                  <div
                    key={champion.id}
                    className="rounded-[1.75rem] border border-pink-400/15 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-pink-300/20 bg-black/40">
                        <Image
                          src={champion.image}
                          alt={champion.name}
                          fill
                          className="object-contain object-center"
                          sizes="80px"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.28em] text-pink-200/70">
                          Champion {index + 1}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                          {champion.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-pink-400/15 bg-white/[0.03] p-6 text-sm leading-6 text-slate-300">
                  Pick a champion to expand the preview, then choose a second
                  to lock in the duo.
                </div>
              )}
            </div>

            <div className="mt-5 rounded-[1.75rem] border border-pink-400/15 bg-black/30 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between text-slate-400">
                <span>Selection cap</span>
                <span>2 champions</span>
              </div>
              <p className="mt-2 leading-6">
                Click again to remove a pick. A third selection will not be
                added until one is cleared.
              </p>
            </div>
          </aside>
        </section>

        <button
          type="button"
          onClick={() => {
            if (!canRoute) {
              return;
            }

            router.push(`/guides/${selectedTeamKey}`);
          }}
          disabled={!canRoute}
          className={`fixed bottom-6 right-6 z-20 rounded-full px-5 py-3 text-sm font-semibold shadow-2xl transition duration-300 ${
            canRoute
              ? "bg-pink-500 text-white shadow-pink-950/40 hover:-translate-y-0.5 hover:bg-pink-400"
              : "cursor-not-allowed bg-white/10 text-slate-400 shadow-black/30"
          }`}
        >
          {selected.length < 2
            ? "Pick 2 champions"
            : "Open team"}
        </button>
      </div>
    </main>
  );
}