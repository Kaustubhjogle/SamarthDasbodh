"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@heroui/react";
import type { SelectedSamasaContext } from "@/app/types/dasbodh";
import ScrollablePanel from "./ScrollablePanel";

type ReaderPaneProps = {
  theme: "dark" | "light" | "grey";
  fontScale: number;
  ovisPerCard: 1 | 2;
  selectedSamasaContext?: SelectedSamasaContext;
  settingsSlot?: ReactNode;
};

export default function ReaderPane({
  theme,
  fontScale,
  ovisPerCard,
  selectedSamasaContext,
  settingsSlot,
}: ReaderPaneProps) {
  const isDark = theme === "dark";
  const isGrey = theme === "grey";
  const marathiFontSizeRem = (1.25 * fontScale) / 100;
  const samasaOrdinals: Record<number, string> = {
    1: "पहिला",
    2: "दुसरा",
    3: "तिसरा",
    4: "चौथा",
    5: "पाचवा",
    6: "सहावा",
    7: "सातवा",
    8: "आठवा",
    9: "नववा",
    10: "दहावा",
  };

  if (!selectedSamasaContext) {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden p-2 sm:p-7">
        <p className={isDark ? "text-zinc-400" : isGrey ? "text-zinc-400" : "text-zinc-600"}>
          no matching samasa found.
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-7">
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={`sticky top-0 z-10 -mx-1 mb-3 rounded-xl px-1 pb-1 pt-1 backdrop-blur md:mb-4 ${
            isDark ? "bg-[#232326]/95" : isGrey ? "bg-[#2c2d31]/95" : "bg-white/90"
          }`}
        >
          <div className="mb-1 md:mb-2 flex items-start justify-between gap-3">
            <div
              className={`text-xl font-semibold ${
                isDark ? "text-zinc-300" : isGrey ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {`${selectedSamasaContext.dashakTitle} \\ `}
              <span className={isDark || isGrey ? "text-zinc-100" : "text-zinc-900"}>
                {selectedSamasaContext.samasa.title}
              </span>
            </div>
            <div className="hidden md:block">{settingsSlot}</div>
          </div>

          <div className="hidden md:block">
            <h1
              className={`font-[family-name:var(--font-manrope)] text-4xl font-bold ${
                isDark || isGrey ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              {selectedSamasaContext.samasa.title}
            </h1>
            <p className={`mt-1 text-lg ${isDark ? "text-zinc-400" : isGrey ? "text-zinc-400" : "text-zinc-600"}`}>
              {`${selectedSamasaContext.dashakTitle} - ${selectedSamasaContext.dashakSubtitle}`}
            </p>
          </div>
        </div>

        {selectedSamasaContext.samasa.ovis.length > 0 ? (
          <ScrollablePanel className="space-y-4">
            <Card
              className={`rounded-xl border shadow-none ${
                isDark
                  ? "border-zinc-700 bg-zinc-900/70"
                  : isGrey
                    ? "border-zinc-600 bg-zinc-900/55"
                    : "border-zinc-200 bg-white/90"
              }`}
            >
              <CardContent
                className={`rounded-xl border-l-2 p-4 ${
                  isDark ? "border-indigo-500" : "border-indigo-400"
                }`}
              >
                <p
                  className={`whitespace-pre-line text-center text-lg leading-relaxed ${
                    isDark || isGrey ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {`|| जय जय रघुवीर समर्थ ||\n|| श्रीमत् दासबोध ||\n|| ${selectedSamasaContext.dashakTitle} - ${selectedSamasaContext.dashakSubtitle} ||\n|| समास ${samasaOrdinals[selectedSamasaContext.samasa.number] ?? selectedSamasaContext.samasa.number} - ${selectedSamasaContext.samasa.title} ||\n|| श्री राम समर्थ ||`}
                </p>
              </CardContent>
            </Card>

            {Array.from(
              { length: Math.ceil(selectedSamasaContext.samasa.ovis.length / ovisPerCard) },
              (_, chunkIndex) =>
                selectedSamasaContext.samasa.ovis.slice(
                  chunkIndex * ovisPerCard,
                  chunkIndex * ovisPerCard + ovisPerCard
                )
            ).map((ovisChunk, chunkIndex) => (
              <Card
                key={`ovi-card-${chunkIndex + 1}`}
                className={`rounded-xl border shadow-none ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900/70"
                    : isGrey
                      ? "border-zinc-600 bg-zinc-900/55"
                      : "border-zinc-200 bg-white/90"
                }`}
              >
                <CardContent
                  className={`rounded-xl border-l-2 p-4 ${
                    isDark ? "border-indigo-500" : "border-indigo-400"
                  }`}
                >
                  {ovisChunk.map((ovi, indexInChunk) => (
                    <div key={ovi.id}>
                      <p className={`mb-2 ${isDark || isGrey ? "text-zinc-400" : "text-zinc-500"}`}>
                        {`Ovi ${chunkIndex * ovisPerCard + indexInChunk + 1}`}
                      </p>
                      <p
                        className={`whitespace-pre-line leading-relaxed ${
                          isDark || isGrey ? "text-zinc-100" : "text-zinc-900"
                        }`}
                        style={{ fontSize: `${marathiFontSizeRem}rem` }}
                      >
                        {ovi.marathi}
                      </p>
                      {ovisPerCard === 1 ? (
                        <div
                          className={`my-3 h-px ${
                            isDark ? "bg-zinc-700" : isGrey ? "bg-zinc-400" : "bg-zinc-200"
                          }`}
                        />
                      ) : null}
                      <p
                        className={`text-lg leading-relaxed ${
                          isDark ? "text-zinc-300" : isGrey ? "text-zinc-300" : "text-zinc-700"
                        }`}
                      >
                        {ovi.english}
                      </p>
                      {ovisPerCard === 1 && indexInChunk < ovisChunk.length - 1 ? (
                        <div
                          className={`my-4 h-px ${
                            isDark ? "bg-zinc-700/80" : isGrey ? "bg-zinc-400" : "bg-zinc-300"
                          }`}
                        />
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </ScrollablePanel>
        ) : (
          <ScrollablePanel className="space-y-4">
            <Card
              className={`rounded-xl border shadow-none ${
                isDark
                  ? "border-zinc-700 bg-zinc-900/70"
                  : isGrey
                    ? "border-zinc-600 bg-zinc-900/55"
                    : "border-zinc-200 bg-white/90"
              }`}
            >
              <CardContent
                className={`rounded-xl border-l-2 p-4 ${
                  isDark ? "border-indigo-500" : "border-indigo-400"
                }`}
              >
                <p
                  className={`whitespace-pre-line text-center text-lg leading-relaxed ${
                    isDark || isGrey ? "text-zinc-100" : "text-zinc-900"
                  }`}
                >
                  {`|| जय जय रघुवीर समर्थ ||\n|| श्रीमत् दासबोध ||\n|| ${selectedSamasaContext.dashakTitle} - ${selectedSamasaContext.dashakSubtitle} ||\n|| समास ${samasaOrdinals[selectedSamasaContext.samasa.number] ?? selectedSamasaContext.samasa.number} - ${selectedSamasaContext.samasa.title} ||\n|| श्री राम समर्थ ||`}
                </p>
              </CardContent>
            </Card>

            <Card
              className={`rounded-xl border shadow-none ${
                isDark
                  ? "border-zinc-700 bg-zinc-900/70"
                  : isGrey
                    ? "border-zinc-600 bg-zinc-900/55"
                    : "border-zinc-200 bg-white/90"
              }`}
            >
              <CardContent
                className={`rounded-xl border-l-2 p-4 ${
                  isDark ? "border-indigo-500" : "border-indigo-400"
                }`}
              >
                <p
                  className={`whitespace-pre-line ${
                    isDark ? "text-zinc-300" : isGrey ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {selectedSamasaContext.samasa.content || "samasa text not available yet."}
                </p>
              </CardContent>
            </Card>
          </ScrollablePanel>
        )}
      </div>
    </section>
  );
}
