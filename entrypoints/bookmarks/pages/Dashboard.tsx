import { useBookmarkStore } from "../store/bookmarkStore";
import { useDashboardStore } from "../store/dashboardStore";

import { getAppName } from "@/lib/info";

import useBanner from "@/hooks/useBanner";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ErrorAlert from "@/components/ErrorAlert";
import BookmarkLayout from "../components/BookmarkLayout";

import type { Theme } from "@/types";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

const Dashboard = ({ theme, onToggleTheme }: Props) => {
  const location = useLocation();
  const { showBanner } = useBanner();
  const [isLoading, setIsLoading] = useState(false);

  const error = useDashboardStore((state) => state.error);
  const setError = useDashboardStore((state) => state.setError);

  const initializeBookmarks = useBookmarkStore((state) => state.initalize);

  useEffect(() => {
    setIsLoading(true);
    initializeBookmarks()
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "failed to load bookmarks");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setError(null);
  }, [location.key]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar title={getAppName()} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header theme={theme} onToggleTheme={onToggleTheme} />

        {showBanner && (
          <p className="border-surface-border bg-surface-alt text-ink-muted dark:border-night-border dark:bg-night-elevated dark:text-paper-muted border-b px-6 py-1.5 text-center text-xs">
            If you find this extension useful, please consider{" "}
            <a
              href="https://github.com/sponsors/sndsabin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-ink dark:text-paper-muted dark:hover:text-paper underline"
            >
              supporting it
            </a>
            .
          </p>
        )}

        <div className="relative z-99">
          {error && <ErrorAlert message={error} className="mx-4" />}
        </div>

        <main className="flex-1 scrollbar-thin overflow-y-auto">
          {isLoading ? (
            <div className="text-ink-muted dark:text-paper-muted flex flex-1 items-center justify-center py-24 text-sm">
              Loading bookmarks…
            </div>
          ) : (
            <BookmarkLayout />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
