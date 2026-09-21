import { useEffect, useMemo, useState } from "react";
import { Bookmark as BookmarkIcon, Trash2, X } from "lucide-react";

import { useBookmarkStore } from "../store/bookmarkStore";
import { useDashboardStore } from "../store/dashboardStore";

import { findDuplicates } from "@/lib/bookmark";

import Pagination from "./Pagination";
import BookmarkCard from "./BookmarkCard";
import BookmarkListItem from "./BookmarkListItem";

import {
  ALL_BOOKMARKS_FOLDER,
  DUPLICATES_FOLDER,
  SORT_MODE_ALPHABETIC,
  SORT_MODE_OLDEST,
  SORT_MODE_RECENT,
  VIEW_MODE_LIST,
} from "@/constants";

import type { Bookmark } from "@/types";

const PAGE_SIZE = 18;

const BookmarkLayout = () => {
  const [page, setPage] = useState(1);
  const [copiedBookmarkId, setCopiedBookmarId] = useState<string | null>(null);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState(new Set<string>());

  const query = useDashboardStore((state) => state.query);
  const sortMode = useDashboardStore((state) => state.sortMode);
  const viewMode = useDashboardStore((state) => state.viewMode);
  const setError = useDashboardStore((state) => state.setError);
  const selectedFolder = useDashboardStore((state) => state.selectedFolder);

  const bookmarksData = useBookmarkStore((state) => state.bookmarks);
  const deleteBookmark = useBookmarkStore((state) => state.deleteBookmark);

  const duplicates = useMemo(() => {
    return findDuplicates(bookmarksData);
  }, [bookmarksData]);

  const duplicatesIds = useMemo(() => {
    return new Set(duplicates.map((duplicate) => duplicate.id));
  }, [duplicates]);

  const handleCopy = (bookmark: Bookmark) => {
    navigator.clipboard
      .writeText(bookmark.url)
      .then(() => {
        setCopiedBookmarId(bookmark.id);
        setTimeout(() => setCopiedBookmarId(null), 1200);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBookmark(id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteSelected = async () => {
    const ids = [...selectedBookmarkIds];

    const results = await Promise.allSettled(ids.map((id) => deleteBookmark(id)));

    const failedIds = new Set(
      results.flatMap((result, i) => (result.status === "rejected" ? [String(ids[i])] : [])),
    );

    if (failedIds.size > 0) {
      setError(`${failedIds.size} bookmark(s) could not be deleted.`);
    }

    setSelectedBookmarkIds(failedIds);
  };

  const clearSelection = () => {
    setSelectedBookmarkIds(new Set());
  };

  const bookmarksByFolder = useMemo(() => {
    const bookmarkMap = new Map<string, Bookmark[]>();

    bookmarksData.forEach((bookmark) => {
      const item = bookmarkMap.get(bookmark.folderId);

      if (item) {
        item.push(bookmark);
      } else {
        bookmarkMap.set(bookmark.folderId, [bookmark]);
      }
    });

    return bookmarkMap;
  }, [bookmarksData]);

  const filtered = useMemo(() => {
    let bookmarks = bookmarksData;

    // select folders
    if (selectedFolder.id === DUPLICATES_FOLDER) {
      bookmarks = duplicates;
    } else if (selectedFolder.id !== ALL_BOOKMARKS_FOLDER) {
      bookmarks = bookmarksByFolder.get(selectedFolder.id) ?? [];
    }

    // search
    const trimmedQuery = query?.trim().toLocaleLowerCase();

    if (trimmedQuery) {
      bookmarks = bookmarks.filter((bookmark) => {
        return (
          bookmark.title.toLowerCase().includes(trimmedQuery) ||
          bookmark.url.toLowerCase().includes(trimmedQuery)
        );
      });
    }

    // sort
    switch (sortMode) {
      case SORT_MODE_RECENT:
        return [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);
      case SORT_MODE_OLDEST:
        return [...bookmarks].sort((a, b) => a.createdAt - b.createdAt);
      case SORT_MODE_ALPHABETIC:
        return [...bookmarks].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return bookmarks;
    }
  }, [bookmarksByFolder, selectedFolder, query, sortMode]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const allSelected = useMemo(() => {
    return paged.every((item) => selectedBookmarkIds.has(item.id));
  }, [paged, selectedBookmarkIds]);

  const toggleSelectAll = () => {
    if (selectedBookmarkIds.size) {
      setSelectedBookmarkIds(new Set());
    } else {
      setSelectedBookmarkIds(new Set(paged.map((item) => item.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedBookmarkIds((prev) => {
      const selectedBookmarkIds = new Set(prev);

      if (selectedBookmarkIds.has(id)) {
        selectedBookmarkIds.delete(id);
      } else {
        selectedBookmarkIds.add(id);
      }

      return selectedBookmarkIds;
    });
  };

  useEffect(() => {
    setSelectedBookmarkIds(new Set()); // reset select bookmark ids
  }, [selectedFolder, query, sortMode, page]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  if (paged.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <span className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-full">
          <BookmarkIcon size={22} className="text-accent" strokeWidth={1.75} />
        </span>
        <p className="text-ink-muted dark:text-paper-muted text-sm">No bookmars found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col">
      <div className="border-surface-border dark:border-night-border flex items-center justify-between gap-2 border-b px-6 py-2.5">
        <label className="text-ink-muted dark:text-paper-muted flex items-center gap-2 py-1 text-xs font-medium">
          <input
            id="select-all-bookmarks"
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            aria-label="Select all visible bookmarks"
            className="accent-accent h-3.5 w-3.5"
          />
          Select all
        </label>
        <span className="text-ink-muted/70 dark:text-paper-muted/70 mr-auto text-xs">
          {paged.length} {paged.length === 1 ? "bookmark" : "bookmarks"}
        </span>

        {selectedBookmarkIds.size > 0 && (
          <>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
            >
              <Trash2 size={13} />
              Delete
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="text-ink-muted hover:bg-ink/5 dark:text-paper-muted flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors dark:hover:bg-white/5"
            >
              <X size={13} />
              Clear
            </button>
          </>
        )}
      </div>

      {viewMode === VIEW_MODE_LIST ? (
        <>
          <div className="flex flex-col gap-0.5 p-4">
            {paged.map((bookmark) => (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                copied={copiedBookmarkId === bookmark.id}
                selected={selectedBookmarkIds.has(bookmark.id)}
                duplicate={duplicatesIds.has(bookmark.id)}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 p-6">
            {paged.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                copied={copiedBookmarkId === bookmark.id}
                selected={selectedBookmarkIds.has(bookmark.id)}
                duplicate={duplicatesIds.has(bookmark.id)}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default BookmarkLayout;
