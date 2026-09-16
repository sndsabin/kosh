import { useState, useEffect, useMemo } from "react";
import { ExternalLink, Search } from "lucide-react";

import useTheme from "@/hooks/useTheme";

import { getAppName } from "@/lib/info";
import { getFaviconUrl } from "@/lib/image";
import { getBookmarks } from "@/lib/bookmark";
import { getHostName, openDashboard, openUrl } from "@/lib/url";

import logo from "@/assets/logo.svg";
import ErrorAlert from "@/components/ErrorAlert";

import type { Bookmark } from "@/types";

const PAGE_SIZE = 7;

const App = () => {
  useTheme();

  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    getBookmarks()
      .then((bookmarks) => {
        const sortedBookmarks = [...bookmarks.bookmarks].sort((a, b) => b.createdAt - a.createdAt);
        setBookmarks(sortedBookmarks);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "failed to load bookmarks");
      });
  }, []);

  const filteredBookmarks = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return bookmarks.slice(0, PAGE_SIZE);
    }

    const result = bookmarks.filter((bookmark) => {
      return (
        bookmark.title.toLowerCase().includes(trimmedQuery) ||
        bookmark.url.toLowerCase().includes(trimmedQuery)
      );
    });

    return result.sort((a, b) => b.createdAt - a.createdAt).slice(0, PAGE_SIZE);
  }, [query, bookmarks]);

  return (
    <div className="bg-surface text-ink dark:bg-night dark:text-paper flex h-[480px] w-[360px] flex-col">
      <div className="border-surface-border dark:border-night-border flex items-center gap-2 border-b px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md">
          <img src={logo} alt="logo" />
        </span>
        <span className="text-sm font-semibold tracking-tight">{getAppName()}</span>
        <button
          onClick={() => openDashboard()}
          className="border-surface-border text-ink-muted hover:text-ink dark:border-night-border dark:text-paper-muted dark:hover:text-paper ml-auto flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
        >
          Dashboard
          <ExternalLink size={12} />
        </button>
      </div>

      <div className="relative z-99">
        {error && <ErrorAlert message={error} className="my-2" />}
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search
            size={15}
            className="text-ink-muted dark:text-paper-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookmarks"
            className="border-surface-border bg-surface-alt focus:border-accent dark:border-night-border dark:bg-night-elevated w-full rounded-full border py-2 pr-3 pl-9 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-2 flex-1 scrollbar-thin overflow-y-auto px-2 pb-3">
        {bookmarks.length === 0 ? (
          <p className="text-ink-muted dark:text-paper-muted mt-10 text-center text-xs">
            No bookmarks found.
          </p>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => openUrl(bookmark.url)}
              className="hover:bg-accent/[0.25] flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors"
            >
              <img
                src={getFaviconUrl(bookmark.url)}
                alt=""
                className="h-5 w-5 shrink-0 rounded-sm"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="text-ink dark:text-paper block truncate text-sm">
                  {bookmark.title}
                </span>
                <span className="text-ink-muted dark:text-paper-muted block truncate text-xs">
                  {getHostName(bookmark.url)}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
