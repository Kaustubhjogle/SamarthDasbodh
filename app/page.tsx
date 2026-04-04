"use client";

import { Card, CardContent } from "@heroui/react";
import dashaksData from "./data/dashaks.json";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import NavigationSidebar from "@/components/NavigationSidebar";
import ReaderPane from "@/components/ReaderPane";
import type { Dashak, SelectedSamasaContext } from "@/app/types/dasbodh";

const dashaks = dashaksData as Dashak[];

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSamasaId, setSelectedSamasaId] = useState(
    dashaks[0]?.samasas[0]?.id ?? ""
  );
  const [openDashakId, setOpenDashakId] = useState(dashaks[0]?.id ?? "");

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

  const selectedSamasaContext: SelectedSamasaContext | undefined = flatSamasas.find(
    (item) => item.samasa.id === activeSamasaId
  );
  const activeOpenDashakId = filteredDashaks.some(
    (dashak) => dashak.id === openDashakId
  )
    ? openDashakId
    : "";
  const activeDashakId = selectedSamasaContext?.dashakId ?? activeOpenDashakId;

  return (
    <div className="h-screen overflow-hidden bg-[#1c1c1f] p-3 text-zinc-100 sm:p-5">
      <Card className="mx-auto h-full w-full max-w-6xl overflow-hidden rounded-[28px] border border-zinc-700/70 bg-[#232326] shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
        <CardContent className="grid h-full p-0 md:grid-cols-[340px_1fr]">
          <NavigationSidebar
            filteredDashaks={filteredDashaks}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            activeDashakId={activeDashakId}
            activeOpenDashakId={activeOpenDashakId}
            activeSamasaId={activeSamasaId}
            onToggleDashak={(dashakId) =>
              setOpenDashakId((currentDashakId) =>
                currentDashakId === dashakId ? "" : dashakId
              )
            }
            onSelectSamasa={(dashakId, samasaId) => {
              setSelectedSamasaId(samasaId);
              setOpenDashakId(dashakId);
            }}
          />

          <ReaderPane selectedSamasaContext={selectedSamasaContext} />
        </CardContent>
      </Card>
    </div>
  );
}
