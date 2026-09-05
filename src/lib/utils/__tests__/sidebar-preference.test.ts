import {
  getDefaultSidebarPreference,
  isCollapsedPreference,
  parseSidebarPreference,
  readSidebarPreference,
  writeSidebarPreference,
  type SidebarPreference,
} from "@/lib/utils/sidebar-preference";

describe("sidebar-preference", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();

    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
        clear: () => {
          storage.clear();
        },
      },
      configurable: true,
    });
  });

  it("returns null for invalid values", () => {
    expect(parseSidebarPreference(null)).toBeNull();
    expect(parseSidebarPreference("invalido")).toBeNull();
    expect(parseSidebarPreference("")).toBeNull();
  });

  it("parses valid values", () => {
    expect(parseSidebarPreference("aberta")).toBe("aberta");
    expect(parseSidebarPreference("recolhida")).toBe("recolhida");
  });

  it("defaults to aberta when storage is empty", () => {
    expect(readSidebarPreference()).toBeNull();
    expect(getDefaultSidebarPreference()).toBe("aberta");
    expect(isCollapsedPreference(null)).toBe(false);
  });

  it("round-trips preference values", () => {
    writeSidebarPreference("recolhida");
    expect(readSidebarPreference()).toBe("recolhida");
    expect(isCollapsedPreference("recolhida")).toBe(true);

    writeSidebarPreference("aberta");
    expect(readSidebarPreference()).toBe("aberta");
    expect(isCollapsedPreference("aberta")).toBe(false);
  });

  it("treats corrupted storage as absent", () => {
    storage.set("imobe.sidebar.state:v1", "corrompido");
    expect(readSidebarPreference()).toBeNull();
  });

  it("does not throw when storage is unavailable", () => {
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
      },
      configurable: true,
    });

    expect(readSidebarPreference()).toBeNull();
    expect(() =>
      writeSidebarPreference("recolhida" satisfies SidebarPreference)
    ).not.toThrow();
  });
});
