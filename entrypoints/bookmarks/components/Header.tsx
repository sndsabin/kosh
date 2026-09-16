import { LayoutGrid, List, Moon, Search, Sun } from "lucide-react";

import { useDashboardStore } from "../store/dashboardStore";

import ViewButton from "./ViewButton";

import {
  SORT_MODE_ALPHABETIC,
  SORT_MODE_OLDEST,
  SORT_MODE_RECENT,
  THEME_MODE_DARK,
  VIEW_MODE_GRID,
  VIEW_MODE_LIST,
} from "@/constants";

import type { SortMode, Theme } from "@/types";
import { formatTitle } from "@/lib/formatter";

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

const Header = ({ theme, onToggleTheme }: Props) => {
  const query = useDashboardStore((state) => state.query);
  const setQuery = useDashboardStore((state) => state.setQuery);
  const sortMode = useDashboardStore((state) => state.sortMode);
  const setSortMode = useDashboardStore((state) => state.setSortMode);
  const viewMode = useDashboardStore((state) => state.viewMode);
  const setViewMode = useDashboardStore((state) => state.setViewMode);
  const selectedFolderName = useDashboardStore((state) => state.selectedFolder.name);

  const title = useMemo(() => {
    return formatTitle(selectedFolderName);
  }, [selectedFolderName]);

  return (
    <header className="border-surface-border dark:border-night-border flex flex-wrap items-center gap-3 border-b px-6 py-4">
      <h1 className="shrink-0 text-lg font-semibold tracking-tight">{title}</h1>

      <div className="relative ml-auto max-w-md flex-1">
        <Search
          size={16}
          className="text-ink-muted dark:text-paper-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          type="text"
          id="search-query"
          value={query ?? ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookmarks"
          className="border-surface-border bg-surface-alt placeholder:text-ink-muted focus:border-accent dark:border-night-border dark:bg-night-elevated dark:placeholder:text-paper-muted w-full rounded-full border py-2 pr-3 pl-9 text-sm transition-colors outline-none"
        />
      </div>

      <select
        id="sort-order"
        value={sortMode}
        onChange={(e) => {
          setSortMode(e.target.value as SortMode);
        }}
        className="border-surface-border bg-surface-alt focus:border-accent dark:border-night-border dark:bg-night-elevated shrink-0 rounded-full border px-3 py-2 text-sm outline-none"
      >
        <option value={SORT_MODE_RECENT}>Recent</option>
        <option value={SORT_MODE_OLDEST}>Oldest</option>
        <option value={SORT_MODE_ALPHABETIC}>A–Z</option>
      </select>

      <div className="border-surface-border dark:border-night-border flex shrink-0 items-center gap-1 rounded-full border p-1">
        <ViewButton
          isActive={viewMode === VIEW_MODE_LIST}
          onClick={() => setViewMode(VIEW_MODE_LIST)}
          label="List view"
          icon={<List size={16} strokeWidth={2} />}
        />
        <ViewButton
          isActive={viewMode === VIEW_MODE_GRID}
          onClick={() => setViewMode(VIEW_MODE_GRID)}
          label="Grid view"
          icon={<LayoutGrid size={16} strokeWidth={2} />}
        />
      </div>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle dark mode"
        className="border-surface-border text-ink-muted hover:text-ink dark:border-night-border dark:text-paper-muted dark:hover:text-paper shrink-0 rounded-full border p-2 transition-colors"
      >
        {theme === THEME_MODE_DARK ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
};

export default Header;
