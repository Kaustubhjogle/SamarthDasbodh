"use client";

import { Input } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ChangeEvent } from "react";
import type { Dashak } from "@/app/types/dasbodh";
import ScrollablePanel from "./ScrollablePanel";

type NavigationSidebarProps = {
  filteredDashaks: Dashak[];
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  activeDashakId: string;
  activeOpenDashakId: string;
  activeSamasaId: string;
  onToggleDashak: (dashakId: string) => void;
  onSelectSamasa: (dashakId: string, samasaId: string) => void;
};

export default function NavigationSidebar({
  filteredDashaks,
  searchValue,
  onSearchChange,
  activeDashakId,
  activeOpenDashakId,
  activeSamasaId,
  onToggleDashak,
  onSelectSamasa,
}: NavigationSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-b border-zinc-700/80 bg-[#252529] p-5 md:border-r md:border-b-0">
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
        onChange={onSearchChange}
        aria-label="search chapters"
        placeholder="Search chapters..."
        className="mb-6 w-full rounded-full"
      />

      <ScrollablePanel className="stable-scrollbar">
        <div className="space-y-5">
          {filteredDashaks.map((dashak) => {
            const isOpen = activeOpenDashakId === dashak.id;
            const isActiveDashak = activeDashakId === dashak.id;

            return (
              <div
                key={dashak.id}
                className={`rounded-2xl p-2 transition ${
                  isActiveDashak
                    ? "bg-indigo-500/10 ring-1 ring-indigo-400/30"
                    : "bg-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleDashak(dashak.id)}
                  className={`mb-2 flex w-full items-center justify-between rounded-xl border px-2 py-1 text-left text-sm font-semibold uppercase tracking-[0.08em] transition ${
                    isActiveDashak
                      ? "border-indigo-400/70 bg-indigo-500/20 text-indigo-100"
                      : "border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <span>{`${dashak.title} - ${dashak.subtitle}`}</span>
                  <span
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
                            : "bg-zinc-900/20"
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
                                  : "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
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
