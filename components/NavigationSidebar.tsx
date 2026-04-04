"use client";

import { Input } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChangeEvent, FormEvent } from "react";
import type { Dashak } from "@/app/types/dasbodh";
import ScrollablePanel from "./ScrollablePanel";

type NavigationSidebarProps = {
  theme: "dark" | "light";
  isSearchActive: boolean;
  filteredDashaks: Dashak[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeDashakId: string;
  activeOpenDashakId: string;
  activeSamasaId: string;
  onOpenDashak: (dashakId: string) => void;
  onToggleDashak: (dashakId: string) => void;
  onSelectSamasa: (dashakId: string, samasaId: string) => void;
};

export default function NavigationSidebar({
  theme,
  isSearchActive,
  filteredDashaks,
  searchValue,
  onSearchChange,
  activeDashakId,
  activeOpenDashakId,
  activeSamasaId,
  onOpenDashak,
  onToggleDashak,
  onSelectSamasa,
}: NavigationSidebarProps) {
  const isDark = theme === "dark";

  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-b p-5 md:border-r md:border-b-0 ${
        isDark
          ? "border-zinc-700/80 bg-[#252529]"
          : "border-zinc-200/90 bg-zinc-50"
      }`}
    >
      <div className="mb-5">
        <p className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold leading-none tracking-tight">
          <span className={isDark ? "text-indigo-400" : "text-indigo-600"}>Bodh</span>
          <span className={isDark ? "text-zinc-100" : "text-zinc-900"}>alay</span>
        </p>
        <p className={`mt-1 text-base ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          Srimath Dasbodh
        </p>
      </div>

      <Input
        key={theme}
        type="text"
        value={searchValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onSearchChange(event.target.value)
        }
        onInput={(event: FormEvent<HTMLInputElement>) =>
          onSearchChange(event.currentTarget.value)
        }
        aria-label="search chapters"
        placeholder="Search chapters..."
        className={`sidebar-search mb-6 w-full rounded-xl ${
          isDark ? "text-zinc-100" : "text-zinc-900"
        }`}
      />

      <ScrollablePanel className="stable-scrollbar">
        <div className="space-y-5">
          {filteredDashaks.map((dashak) => {
            const isOpen = isSearchActive
              ? dashak.samasas.length > 0
              : activeOpenDashakId === dashak.id;
            const isActiveDashak = activeDashakId === dashak.id;

            return (
              <div
                key={dashak.id}
                className={`rounded-2xl p-2 transition ${
                  isActiveDashak
                    ? "bg-indigo-500/10 ring-1 ring-indigo-400/30"
                    : isDark
                      ? "bg-transparent"
                      : "bg-white/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!isSearchActive) {
                      onOpenDashak(dashak.id);
                    }
                  }}
                  className={`mb-2 flex w-full items-center justify-between rounded-xl border px-2 py-1 text-left text-sm font-semibold uppercase tracking-[0.08em] transition ${
                    isActiveDashak
                      ? isDark
                        ? "border-indigo-400/70 bg-indigo-500/20 text-indigo-100"
                        : "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : isDark
                        ? "border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-zinc-200"
                        : "border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <span>{`${dashak.title} - ${dashak.subtitle}`}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`${isOpen ? "Close" : "Open"} ${dashak.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!isSearchActive) {
                        onToggleDashak(dashak.id);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        if (!isSearchActive) {
                          onToggleDashak(dashak.id);
                        }
                      }
                    }}
                    className={`text-base transition-transform duration-300 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={`panel-${dashak.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`space-y-1.5 rounded-xl p-2 ${
                          isActiveDashak
                            ? "bg-indigo-500/10 ring-1 ring-indigo-300/20"
                            : isDark
                              ? "bg-zinc-900/20"
                              : "bg-zinc-100/70"
                        }`}
                      >
                        {dashak.samasas.map((samasa) => {
                          const isSelected = samasa.id === activeSamasaId;

                          return (
                            <button
                              key={samasa.id}
                              type="button"
                              onClick={() => onSelectSamasa(dashak.id, samasa.id)}
                              className={`w-full rounded-xl px-3 py-2 text-left transition ${
                                isSelected
                                  ? "bg-indigo-100 text-indigo-700"
                                  : isDark
                                    ? "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                              }`}
                            >
                              <span className="font-semibold">{`समास ${samasa.number}`}</span>
                              <span>{` - ${samasa.title}`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollablePanel>
    </aside>
  );
}
