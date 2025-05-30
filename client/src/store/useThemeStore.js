import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("strimo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("strimo-theme", theme);
    set({ theme });
  },
}));
