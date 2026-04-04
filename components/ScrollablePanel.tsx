"use client";

import type { ReactNode } from "react";

type ScrollablePanelProps = {
  children: ReactNode;
  className?: string;
};

export default function ScrollablePanel({
  children,
  className = "",
}: ScrollablePanelProps) {
  return <div className={`min-h-0 flex-1 overflow-y-auto pr-1 ${className}`}>{children}</div>;
}
