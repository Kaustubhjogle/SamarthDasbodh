"use client";

import { Card, CardContent } from "@heroui/react";
import type { SelectedSamasaContext } from "@/app/types/dasbodh";
import ScrollablePanel from "./ScrollablePanel";

type ReaderPaneProps = {
  selectedSamasaContext?: SelectedSamasaContext;
};

export default function ReaderPane({ selectedSamasaContext }: ReaderPaneProps) {
  if (!selectedSamasaContext) {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-7">
        <p className="text-zinc-400">no matching samasa found.</p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-7">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 -mx-1 mb-4 rounded-xl bg-[#232326]/95 px-1 pb-4 pt-1 backdrop-blur">
          <div className="text-xl font-semibold text-zinc-300">
            {`${selectedSamasaContext.dashakTitle} \\ `}
            <span className="text-zinc-100">{selectedSamasaContext.samasa.title}</span>
          </div>

          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-4xl font-bold text-zinc-100">
              {selectedSamasaContext.samasa.title}
            </h1>
            <p className="mt-1 text-lg text-zinc-400">
              {`${selectedSamasaContext.dashakTitle} - ${selectedSamasaContext.dashakSubtitle}`}
            </p>
          </div>
        </div>

        {selectedSamasaContext.samasa.ovis.length > 0 ? (
          <ScrollablePanel className="space-y-4">
            {selectedSamasaContext.samasa.ovis.map((ovi, index) => (
              <Card
                key={ovi.id}
                className="rounded-xl border border-zinc-700 bg-zinc-900/70 shadow-none"
              >
                <CardContent className="rounded-xl border-l-2 border-indigo-500 p-4">
                  <p className="mb-2 text-zinc-400">{`Ovi ${index + 1}`}</p>
                  <p className="whitespace-pre-line text-xl leading-relaxed text-zinc-100">
                    {ovi.marathi}
                  </p>
                  <div className="my-3 h-px bg-zinc-700" />
                  <p className="text-lg leading-relaxed text-zinc-300">{ovi.english}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollablePanel>
        ) : (
          <Card className="rounded-xl border border-zinc-700 bg-zinc-900/70 shadow-none">
            <CardContent className="rounded-xl border-l-2 border-indigo-500 p-4">
              <p className="whitespace-pre-line text-zinc-300">
                {selectedSamasaContext.samasa.content || "samasa text not available yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
