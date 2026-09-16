import { useState, useEffect } from "react";

import { getTheme as getThemeFromStorage, setTheme as setThemeToStorage } from "@/lib/storage";

import { THEME_MODE_DARK, THEME_MODE_LIGHT } from "@/constants";

import type { Theme } from "@/types";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(THEME_MODE_LIGHT);

  useEffect(() => {
    getThemeFromStorage().then((theme) => {
      setTheme(theme);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === THEME_MODE_DARK);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === THEME_MODE_LIGHT ? THEME_MODE_DARK : THEME_MODE_LIGHT;

    setTheme(newTheme);
    setThemeToStorage(newTheme);
  };

  return {
    theme: theme,
    toggleTheme: toggleTheme,
  };
};

export default useTheme;
