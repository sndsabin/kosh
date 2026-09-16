import { storage } from "#imports";
import { THEME_MODE_DARK, THEME_MODE_LIGHT } from "@/constants";

import type { Theme } from "@/types";

const THEME_STORAGE_KEY = "local:koshTheme";
const BANNER_STORAGE_KEY = "local:koshBanner";

export async function getTheme() {
  const theme = await storage.getItem(THEME_STORAGE_KEY);

  return theme === THEME_MODE_DARK ? THEME_MODE_DARK : THEME_MODE_LIGHT;
}

export async function setTheme(theme: Theme) {
  return storage.setItem(THEME_STORAGE_KEY, theme);
}

export async function isBannerEnabled(): Promise<boolean> {
  const status = await storage.getItem(BANNER_STORAGE_KEY);

  return status === false ? false : true;
}

export async function toggleBanner() {
  const status = await isBannerEnabled();
  return await storage.setItem(BANNER_STORAGE_KEY, !status);
}
