import { create } from "zustand";

import { ALL_BOOKMARKS_FOLDER, SORT_MODE_RECENT, VIEW_MODE_GRID } from "@/constants";

import type { SortMode, ViewMode } from "@/types";

interface SelectedFolder {
  id: string;
  name: string;
}

interface DashboardState {
  query: string | null;
  error: string | null;
  viewMode: ViewMode;
  sortMode: SortMode;
  isSidebarOpen: boolean;
  selectedFolder: SelectedFolder;

  setError: (err: string | null) => void;
  setQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  toggleSidebar: () => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setSelectedFolder: (id: string, name: string) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  error: null,
  query: null,
  viewMode: VIEW_MODE_GRID,
  sortMode: SORT_MODE_RECENT,
  isSidebarOpen: true,
  selectedFolder: {
    id: ALL_BOOKMARKS_FOLDER,
    name: ALL_BOOKMARKS_FOLDER,
  },

  setError: (err: string | null) => set({ error: err }),
  setQuery: (query: string) => set({ query: query }),
  setViewMode: (mode: ViewMode) => set({ viewMode: mode }),
  setSortMode: (mode: SortMode) => set({ sortMode: mode }),
  setIsSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((prev) => ({ isSidebarOpen: !prev.isSidebarOpen })),
  setSelectedFolder: (id: string, name: string) => set({ selectedFolder: { id: id, name: name } }),
}));
