import { storage } from "#imports";
import { THEME_MODE_DARK, THEME_MODE_LIGHT, VIEW_MODE_GRID, VIEW_MODE_LIST } from "@/constants";

import type { Theme, ViewMode } from "@/types";

const THEME_STORAGE_KEY = "local:koshTheme";
const BANNER_STORAGE_KEY = "local:koshBanner";
const VIEW_MODE_STORAGE_KEY = "local:koshViewMode";

export async function getTheme() {
  const theme = await storage.getItem(THEME_STORAGE_KEY);

  if (theme) {
    return theme === THEME_MODE_DARK ? THEME_MODE_DARK : THEME_MODE_LIGHT;
  } else {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_MODE_DARK
      : THEME_MODE_LIGHT;
  }
}

export async function setTheme(theme: Theme) {
  return storage.setItem(THEME_STORAGE_KEY, theme);
}

export async function getViewMode(): Promise<ViewMode> {
  const viewMode = await storage.getItem(VIEW_MODE_STORAGE_KEY);

  return viewMode === VIEW_MODE_LIST ? VIEW_MODE_LIST : VIEW_MODE_GRID;
}

export async function setViewMode(viewMode: ViewMode) {
  return storage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
}

export async function isBannerEnabled(): Promise<boolean> {
  const status = await storage.getItem(BANNER_STORAGE_KEY);

  return status === false ? false : true;
}

export async function toggleBanner() {
  const status = await isBannerEnabled();
  return await storage.setItem(BANNER_STORAGE_KEY, !status);
}
