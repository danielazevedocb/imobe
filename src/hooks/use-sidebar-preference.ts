"use client";

import { useCallback, useState } from "react";

import { writeSidebarPreference } from "@/lib/utils/sidebar-preference";

function getInitialCollapsed(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.dataset.sidebarCollapsed === "true";
}

function syncCollapsedState(isCollapsed: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.sidebarCollapsed = isCollapsed
    ? "true"
    : "false";
}

export function useSidebarPreference() {
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);

  const setCollapsed = useCallback((next: boolean) => {
    setIsCollapsed(next);
    syncCollapsedState(next);
    writeSidebarPreference(next ? "recolhida" : "aberta");
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((previous) => {
      const next = !previous;
      syncCollapsedState(next);
      writeSidebarPreference(next ? "recolhida" : "aberta");
      return next;
    });
  }, []);

  return {
    isCollapsed,
    setCollapsed,
    toggleCollapsed,
  };
}
