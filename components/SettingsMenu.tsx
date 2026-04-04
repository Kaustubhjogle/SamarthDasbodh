"use client";

import { Dropdown } from "@heroui/react";

type Theme = "dark" | "light" | "grey";

type SettingsMenuProps = {
  theme: Theme;
  fontScale: number;
  ovisPerCard: 1 | 2;
  compact?: boolean;
  onThemeToggle: () => void;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  onSetOvisPerCard: (value: 1 | 2) => void;
};

export default function SettingsMenu({
  theme,
  fontScale,
  ovisPerCard,
  compact = false,
  onThemeToggle,
  onIncreaseFont,
  onDecreaseFont,
  onSetOvisPerCard,
}: SettingsMenuProps) {
  const isDark = theme === "dark";
  const isGrey = theme === "grey";
  const themeLabel = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "Grey";

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="open settings"
        className={`flex items-center justify-center rounded-full border transition ${
          isDark
            ? "border-zinc-600 bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700"
            : isGrey
              ? "border-zinc-600 bg-zinc-700/80 text-zinc-100 hover:bg-zinc-600"
              : "border-zinc-300 bg-white/95 text-zinc-800 hover:bg-zinc-100"
        } ${compact ? "h-9 w-9" : "h-11 w-11"}`}
      >
        <span className={`${compact ? "text-xl" : "text-2xl"} leading-none`}>⚙</span>
      </Dropdown.Trigger>

      <Dropdown.Popover
        placement="bottom end"
        className={`min-w-[12rem] rounded-xl border p-1 shadow-xl ${
          isDark
            ? "border-zinc-700 bg-zinc-900/95"
            : isGrey
              ? "border-zinc-600 bg-zinc-800/95"
              : "border-zinc-200 bg-white/95"
        }`}
      >
        <div className="space-y-1 p-1">
          <button
            type="button"
            onClick={onThemeToggle}
            className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition ${
              isDark
                ? "text-zinc-100 hover:bg-zinc-800"
                : isGrey
                  ? "text-zinc-100 hover:bg-zinc-700"
                  : "text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            {`Theme: ${themeLabel} (tap to change)`}
          </button>

          <div
            className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
              isDark ? "text-zinc-300" : isGrey ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            <span className="text-xs">{`Font: ${fontScale}%`}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="decrease font size"
                onClick={onDecreaseFont}
                className={`h-7 w-7 rounded-md text-sm font-semibold transition ${
                  isDark
                    ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    : isGrey
                      ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                -
              </button>
              <button
                type="button"
                aria-label="increase font size"
                onClick={onIncreaseFont}
                className={`h-7 w-7 rounded-md text-sm font-semibold transition ${
                  isDark
                    ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    : isGrey
                      ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                +
              </button>
            </div>
          </div>

          <div
            className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
              isDark ? "text-zinc-300" : isGrey ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            <span className="text-xs">Ovis per card</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="one ovi per card"
                onClick={() => onSetOvisPerCard(1)}
                className={`h-7 w-7 rounded-md text-sm font-semibold transition ${
                  ovisPerCard === 1
                    ? "bg-indigo-500 text-white"
                    : isDark
                      ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                      : isGrey
                        ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                        : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                1
              </button>
              <button
                type="button"
                aria-label="two ovis per card"
                onClick={() => onSetOvisPerCard(2)}
                className={`h-7 w-7 rounded-md text-sm font-semibold transition ${
                  ovisPerCard === 2
                    ? "bg-indigo-500 text-white"
                    : isDark
                      ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                      : isGrey
                        ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                        : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                2
              </button>
            </div>
          </div>
        </div>
      </Dropdown.Popover>
    </Dropdown>
  );
}
