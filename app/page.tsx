"use client";

import { Card, CardContent } from "@heroui/react";
import dashaksData from "./data/dashaks.json";
import { useEffect, useState } from "react";
import NavigationSidebar from "@/components/NavigationSidebar";
import ReaderPane from "@/components/ReaderPane";
import SettingsMenu from "@/components/SettingsMenu";
import type { Dashak, SelectedSamasaContext } from "@/app/types/dasbodh";
import useDashakSearch from "@/components/useDashakSearch";

const dashaks = dashaksData as Dashak[];
type Theme = "dark" | "light" | "grey";
const MIN_FONT_SCALE = 80;
const MAX_FONT_SCALE = 130;
const FONT_STEP = 10;
const SCHEDULE_ANCHOR = new Date(2026, 2, 30); // March 30, 2026 (Monday)
const ANCHOR_DASHAK = 17;
const ANCHOR_SAMASA = 8;

type DefaultSelection = {
  dashakId: string;
  samasaId: string;
};

const getFirstSelection = (): DefaultSelection => ({
  dashakId: dashaks[0]?.id ?? "",
  samasaId: dashaks[0]?.samasas[0]?.id ?? "",
});

const getWeeklyDefaultSelection = (currentDate: Date): DefaultSelection => {
  if (dashaks.length === 0) {
    return { dashakId: "", samasaId: "" };
  }

  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  if (today.getTime() < SCHEDULE_ANCHOR.getTime()) {
    return getFirstSelection();
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const dayDiff = Math.floor((today.getTime() - SCHEDULE_ANCHOR.getTime()) / msPerDay);
  const weekOffset = Math.floor(dayDiff / 7);

  const totalSamasas = dashaks.length * 10;
  const anchorIndex = (ANCHOR_DASHAK - 1) * 10 + (ANCHOR_SAMASA - 1);
  const cycleIndex = ((anchorIndex + weekOffset) % totalSamasas + totalSamasas) % totalSamasas;

  const targetDashakNumber = Math.floor(cycleIndex / 10) + 1;
  const targetSamasaNumber = (cycleIndex % 10) + 1;

  const targetDashak = dashaks.find((dashak) => dashak.number === targetDashakNumber);
  const targetSamasa = targetDashak?.samasas.find(
    (samasa) => samasa.number === targetSamasaNumber
  );

  if (!targetDashak || !targetSamasa) {
    return getFirstSelection();
  }

  return {
    dashakId: targetDashak.id,
    samasaId: targetSamasa.id,
  };
};

export default function Home() {
  const [defaultSelection] = useState<DefaultSelection>(() =>
    getWeeklyDefaultSelection(new Date())
  );
  const [searchValue, setSearchValue] = useState("");
  const [selectedSamasaId, setSelectedSamasaId] = useState(defaultSelection.samasaId);
  const [openDashakId, setOpenDashakId] = useState(defaultSelection.dashakId);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("grey");
  const [fontScale, setFontScale] = useState<number>(100);
  const [ovisPerCard, setOvisPerCard] = useState<1 | 2>(1);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dasbodh-theme");
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "grey") {
      setTheme(savedTheme);
    }

    const savedFontScale = Number(localStorage.getItem("dasbodh-font-scale") ?? "100");
    if (!Number.isNaN(savedFontScale)) {
      setFontScale(Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, savedFontScale)));
    }

    const savedOvisPerCard = Number(localStorage.getItem("dasbodh-ovis-per-card") ?? "2");
    setOvisPerCard(savedOvisPerCard === 2 ? 2 : 1);
  }, []);

  useEffect(() => {
    localStorage.setItem("dasbodh-theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("dasbodh-font-scale", String(fontScale));
  }, [fontScale]);
  useEffect(() => {
    localStorage.setItem("dasbodh-ovis-per-card", String(ovisPerCard));
  }, [ovisPerCard]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredDashaks = useDashakSearch(dashaks, searchValue);

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
  const currentDashakLabel = selectedSamasaContext?.dashakTitle ?? "Dashak";
  const currentSamasaTitle = selectedSamasaContext?.samasa.title ?? "समास";
  const currentSamasaNumber = selectedSamasaContext?.samasa.number;
  const isDark = theme === "dark";
  const isGrey = theme === "grey";
  const cycleTheme = () => {
    setTheme((current) =>
      current === "grey" ? "dark" : current === "dark" ? "light" : "grey"
    );
  };

  return (
    <div
      className={`h-screen overflow-hidden p-2 sm:p-5 ${
        isDark
          ? "bg-[#1c1c1f] text-zinc-100"
          : isGrey
            ? "bg-[#222327] text-zinc-100"
            : "bg-zinc-100 text-zinc-900"
      }`}
      style={{ fontSize: `${fontScale}%` }}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
      <Card
        className={`h-full w-full overflow-hidden rounded-[28px] border shadow-[0_16px_50px_rgba(0,0,0,0.18)] ${
          isDark
            ? "border-zinc-700/70 bg-[#232326]"
            : isGrey
              ? "border-zinc-600/80 bg-[#2c2d31]"
              : "border-zinc-300/90 bg-white"
        }`}
      >
        <CardContent className="grid h-full p-0 md:grid-cols-[340px_1fr]">
          <NavigationSidebar
            theme={theme}
            isSearchActive={searchValue.trim().length > 0}
            isMobileNavOpen={isMobileNavOpen}
            filteredDashaks={filteredDashaks}
            searchValue={searchValue}
            currentDashakLabel={currentDashakLabel}
            currentSamasaTitle={currentSamasaTitle}
            currentSamasaNumber={currentSamasaNumber}
            mobileSettingsSlot={
              <SettingsMenu
                theme={theme}
                fontScale={fontScale}
                ovisPerCard={ovisPerCard}
                compact
                onThemeToggle={cycleTheme}
                onIncreaseFont={() =>
                  setFontScale((current) =>
                    Math.min(MAX_FONT_SCALE, current + FONT_STEP)
                  )
                }
                onDecreaseFont={() =>
                  setFontScale((current) =>
                    Math.max(MIN_FONT_SCALE, current - FONT_STEP)
                  )
                }
                onSetOvisPerCard={setOvisPerCard}
              />
            }
            onSearchChange={handleSearchChange}
            activeDashakId={activeDashakId}
            activeOpenDashakId={activeOpenDashakId}
            activeSamasaId={activeSamasaId}
            onToggleMobileNav={() => setIsMobileNavOpen((current) => !current)}
            onCloseMobileNav={() => setIsMobileNavOpen(false)}
            onOpenDashak={(dashakId) => setOpenDashakId(dashakId)}
            onToggleDashak={(dashakId) =>
              setOpenDashakId((currentDashakId) =>
                currentDashakId === dashakId ? "" : dashakId
              )
            }
            onSelectSamasa={(dashakId, samasaId) => {
              setSelectedSamasaId(samasaId);
              setOpenDashakId(dashakId);
              setIsMobileNavOpen(false);
            }}
          />

          <ReaderPane
            theme={theme}
            fontScale={fontScale}
            ovisPerCard={ovisPerCard}
            selectedSamasaContext={selectedSamasaContext}
            settingsSlot={
              <SettingsMenu
                theme={theme}
                fontScale={fontScale}
                ovisPerCard={ovisPerCard}
                onThemeToggle={cycleTheme}
                onIncreaseFont={() =>
                  setFontScale((current) =>
                    Math.min(MAX_FONT_SCALE, current + FONT_STEP)
                  )
                }
                onDecreaseFont={() =>
                  setFontScale((current) =>
                    Math.max(MIN_FONT_SCALE, current - FONT_STEP)
                  )
                }
                onSetOvisPerCard={setOvisPerCard}
              />
            }
          />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
