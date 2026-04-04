"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@heroui/react";
import type { SelectedSamasaContext } from "@/app/types/dasbodh";
import ScrollablePanel from "./ScrollablePanel";

type ReaderPaneProps = {
  theme: "dark" | "light";
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
  const marathiFontSizeRem = (1.25 * fontScale) / 100;

  if (!selectedSamasaContext) {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-7">
        <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>no matching samasa found.</p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-7">
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={`sticky top-0 z-10 -mx-1 mb-4 rounded-xl px-1 pb-4 pt-1 backdrop-blur ${
            isDark ? "bg-[#232326]/95" : "bg-white/90"
          }`}
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div
              className={`text-xl font-semibold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {`${selectedSamasaContext.dashakTitle} \\ `}
              <span className={isDark ? "text-zinc-100" : "text-zinc-900"}>
                {selectedSamasaContext.samasa.title}
              </span>
            </div>
            {settingsSlot}
          </div>

          <div>
            <h1
              className={`font-[family-name:var(--font-manrope)] text-4xl font-bold ${
                isDark ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              {selectedSamasaContext.samasa.title}
            </h1>
            <p className={`mt-1 text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {`${selectedSamasaContext.dashakTitle} - ${selectedSamasaContext.dashakSubtitle}`}
            </p>
          </div>
        </div>

        {selectedSamasaContext.samasa.ovis.length > 0 ? (
          <ScrollablePanel className="space-y-4">
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
                      <p className={`mb-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        {`Ovi ${chunkIndex * ovisPerCard + indexInChunk + 1}`}
                      </p>
                      <p
                        className={`whitespace-pre-line leading-relaxed ${
                          isDark ? "text-zinc-100" : "text-zinc-900"
                        }`}
                        style={{ fontSize: `${marathiFontSizeRem}rem` }}
                      >
                        {ovi.marathi}
                      </p>
                      {ovisPerCard === 1 ? (
                        <div className={`my-3 h-px ${isDark ? "bg-zinc-700" : "bg-zinc-200"}`} />
                      ) : null}
                      <p
                        className={`text-lg leading-relaxed ${
                          isDark ? "text-zinc-300" : "text-zinc-700"
                        }`}
                      >
                        {ovi.english}
                      </p>
                      {ovisPerCard === 1 && indexInChunk < ovisChunk.length - 1 ? (
                        <div className={`my-4 h-px ${isDark ? "bg-zinc-700/80" : "bg-zinc-300"}`} />
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </ScrollablePanel>
        ) : (
          <Card
            className={`rounded-xl border shadow-none ${
              isDark ? "border-zinc-700 bg-zinc-900/70" : "border-zinc-200 bg-white/90"
            }`}
          >
            <CardContent
              className={`rounded-xl border-l-2 p-4 ${
                isDark ? "border-indigo-500" : "border-indigo-400"
              }`}
            >
              <p className={`whitespace-pre-line ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                {selectedSamasaContext.samasa.content || "samasa text not available yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
