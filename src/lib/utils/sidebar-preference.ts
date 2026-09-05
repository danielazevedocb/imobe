export const SIDEBAR_PREFERENCE_KEY = "imobe.sidebar.state:v1";

export type SidebarPreference = "aberta" | "recolhida";

export function parseSidebarPreference(
  raw: string | null
): SidebarPreference | null {
  if (raw === "aberta" || raw === "recolhida") {
    return raw;
  }

  return null;
}

export function readSidebarPreference(): SidebarPreference | null {
  try {
    if (typeof localStorage === "undefined") {
      return null;
    }

    return parseSidebarPreference(localStorage.getItem(SIDEBAR_PREFERENCE_KEY));
  } catch {
    return null;
  }
}

export function writeSidebarPreference(value: SidebarPreference): void {
  try {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.setItem(SIDEBAR_PREFERENCE_KEY, value);
  } catch {
    // Storage indisponível — toggle continua funcionando na sessão.
  }
}

export function getDefaultSidebarPreference(): SidebarPreference {
  return "aberta";
}

export function isCollapsedPreference(
  preference: SidebarPreference | null
): boolean {
  return preference === "recolhida";
}
