"use client";

import { Card, CardContent, Input } from "@heroui/react";
import dashaksData from "./data/dashaks.json";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

type Ovi = {
  id: string;
  marathi: string;
  english: string;
};

type Samasa = {
  id: string;
  number: number;
  title: string;
  content: string;
  ovis: Ovi[];
};

type Dashak = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  sourceUrl: string;
  samasas: Samasa[];
};

const dashaks = dashaksData as Dashak[];

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSamasaId, setSelectedSamasaId] = useState(
    dashaks[0]?.samasas[0]?.id ?? ""
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const filteredDashaks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return dashaks;
    }

    return dashaks
      .map((dashak) => {
        const matchingSamasas = dashak.samasas.filter((samasa) =>
          samasa.title.toLowerCase().includes(query)
        );
        const dashakMatches = `${dashak.title} ${dashak.subtitle}`
          .toLowerCase()
          .includes(query);

        if (!dashakMatches && matchingSamasas.length === 0) {
          return null;
        }

        return {
          ...dashak,
          samasas: dashakMatches ? dashak.samasas : matchingSamasas,
        };
      })
      .filter((dashak): dashak is Dashak => dashak !== null);
  }, [searchValue]);

  const flatSamasas = filteredDashaks.flatMap((dashak) =>
    dashak.samasas.map((samasa) => ({
      dashakId: dashak.id,
      dashakTitle: dashak.title,
      dashakSubtitle: dashak.subtitle,
      samasa,
    }))
  );

  const activeSamasaId = flatSamasas.some(
    (item) => item.samasa.id === selectedSamasaId
  )
    ? selectedSamasaId
    : (flatSamasas[0]?.samasa.id ?? "");

  const selectedSamasaContext = flatSamasas.find(
    (item) => item.samasa.id === activeSamasaId
  );

  return (
    <div className="min-h-screen bg-[#1c1c1f] p-3 text-zinc-100 sm:p-5">
      <Card className="mx-auto min-h-[92vh] w-full max-w-6xl border border-zinc-700/70 bg-[#232326] shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
        <CardContent className="grid min-h-[92vh] p-0 md:grid-cols-[340px_1fr]">
          <aside className="border-b border-zinc-700/80 bg-[#252529] p-5 md:border-r md:border-b-0">
            <div className="mb-5">
              <p className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold leading-none tracking-tight">
                <span className="text-indigo-400">Bodh</span>
                <span className="text-zinc-100">alay</span>
              </p>
              <p className="mt-1 text-base text-zinc-400">Srimath Dasbodh</p>
            </div>

            <Input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="search chapters"
              placeholder="Search chapters..."
              className="mb-6"
            />

            <div className="space-y-5">
              {filteredDashaks.map((dashak) => (
                <div key={dashak.id}>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-400">
                    {`${dashak.title} - ${dashak.subtitle}`}
                  </p>
                  <div className="space-y-1.5">
                    {dashak.samasas.map((samasa) => {
                      const isSelected = samasa.id === activeSamasaId;

                      return (
                        <button
                          key={samasa.id}
                          type="button"
                          onClick={() => setSelectedSamasaId(samasa.id)}
                          className={`w-full rounded-lg px-3 py-2 text-left transition ${
                            isSelected
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                          }`}
                        >
                          <span className="font-semibold">{`समास ${samasa.number}`}</span>
                          <span>{` - ${samasa.title}`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="p-5 sm:p-7">
            {selectedSamasaContext ? (
              <div className="space-y-5">
                <div className="text-xl font-semibold text-zinc-300">
                  {`${selectedSamasaContext.dashakTitle} \\ `}
                  <span className="text-zinc-100">
                    {selectedSamasaContext.samasa.title}
                  </span>
                </div>

                <div>
                  <h1 className="font-[family-name:var(--font-manrope)] text-4xl font-bold text-zinc-100">
                    {selectedSamasaContext.samasa.title}
                  </h1>
                  <p className="mt-1 text-lg text-zinc-400">
                    {`${selectedSamasaContext.dashakTitle} - ${selectedSamasaContext.dashakSubtitle}`}
                  </p>
                </div>

                {selectedSamasaContext.samasa.ovis.length > 0 ? (
                  <div className="space-y-4">
                    {selectedSamasaContext.samasa.ovis.map((ovi, index) => (
                      <Card
                        key={ovi.id}
                        className="border border-zinc-700 bg-zinc-900/70 shadow-none"
                      >
                        <CardContent className="border-l-2 border-indigo-500 p-4">
                          <p className="mb-2 text-zinc-400">{`Ovi ${index + 1}`}</p>
                          <p className="whitespace-pre-line text-2xl leading-relaxed text-zinc-100">
                            {ovi.marathi}
                          </p>
                          <div className="my-3 h-px bg-zinc-700" />
                          <p className="text-lg leading-relaxed text-zinc-300">
                            {ovi.english}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border border-zinc-700 bg-zinc-900/70 shadow-none">
                    <CardContent className="border-l-2 border-indigo-500 p-4">
                      <p className="whitespace-pre-line text-zinc-300">
                        {selectedSamasaContext.samasa.content || "samasa text not available yet."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <p className="text-zinc-400">no matching samasa found.</p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
