import { create } from "zustand";
import { browser } from "wxt/browser";

import {
  moveFolder,
  createFolder,
  removeFolder,
  renameFolder,
  getBookmarks,
  moveBookmark,
  deleteBookmark,
  getFolderSubtreeIds,
} from "@/lib/bookmark";

import { type Folder, type Bookmark } from "@/types";
import { getColor } from "@/lib/color";

interface BookmarkState {
  folders: Folder[];
  bookmarks: Bookmark[];
  isImporting: boolean;
  isListenerIntialized: boolean;

  setFolders: (folders: Folder[]) => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  setIsImporting: (val: boolean) => void;

  moveBookmark: (id: string, parentId: string) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;

  renameFolder: (id: string, name: string) => Promise<void>;
  createFolder: (name: string, parentId: string) => Promise<void>;
  moveFolder: (id: string, parentId: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  initalize: () => Promise<void>;
}

const TIMEOUT_DELAY = 150;
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
export const refreshBookmarkData = () => {
  clearTimeout(refreshTimer);

  refreshTimer = setTimeout(() => {
    getBookmarks().then((data) => {
      useBookmarkStore.setState({ folders: data.folders, bookmarks: data.bookmarks });
    });
  }, TIMEOUT_DELAY);
};

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  folders: [],
  bookmarks: [],
  isImporting: false,
  isListenerIntialized: false,

  setFolders: (folders: Folder[]) => set({ folders: folders }),
  setBookmarks: (bookmarks: Bookmark[]) => set({ bookmarks: bookmarks }),
  setIsImporting: (val: boolean) => set({ isImporting: val }),

  moveBookmark: async (id: string, parentId: string) => {
    await moveBookmark(id, parentId);
  },
  deleteBookmark: async (id: string) => {
    await deleteBookmark(id);
  },
  renameFolder: async (id: string, name: string) => {
    await renameFolder(id, name);
  },
  createFolder: async (name: string, parentId: string) => {
    await createFolder(name, parentId);
  },
  moveFolder: async (id: string, parentId: string) => {
    await moveFolder(id, parentId);
  },
  deleteFolder: async (id: string) => {
    await removeFolder(id);
  },
  initalize: async () => {
    const initListeners = () => {
      if (!get()["isListenerIntialized"]) {
        browser.bookmarks.onCreated.addListener((_, data) => {
          if (get().isImporting) {
            return;
          }

          if (data.url !== undefined) {
            // bookmark
            const newBookmark: Bookmark = {
              id: data.id,
              folderId: data.parentId!,
              url: data.url,
              title: data.title,
              createdAt: data.dateAdded ?? Date.now(),
            };

            set((prev) => ({
              bookmarks: [...prev.bookmarks, newBookmark],
            }));

            return;
          }

          // folder
          const newFolder: Folder = {
            id: data.id,
            parentId: data.parentId,
            title: data.title,
            color: getColor(data.id),
            createdAt: data.dateAdded ?? Date.now(),
          };

          set((prev) => ({
            folders: [...prev.folders, newFolder],
          }));
        });

        browser.bookmarks.onRemoved.addListener((id, data) => {
          if (get().isImporting) {
            return;
          }

          if (data.node.url !== undefined) {
            // bookmark
            set((prev) => ({
              bookmarks: prev.bookmarks.filter((bookmark) => bookmark.id !== id),
            }));

            return;
          }

          // folder
          set((prev) => {
            const removedFolderIds = new Set(getFolderSubtreeIds(id, prev.folders));

            return {
              folders: prev.folders.filter((folder) => !removedFolderIds.has(folder.id)),
              bookmarks: prev.bookmarks.filter(
                (bookmark) => !removedFolderIds.has(bookmark.folderId),
              ),
            };
          });
        });
        browser.bookmarks.onChanged.addListener((id, data) => {
          if (get().isImporting) {
            return;
          }

          set((prev) => {
            // folder changed
            const folder = prev.folders.find((folder) => folder.id === id);

            if (folder) {
              return {
                folders: prev.folders.map((folder) =>
                  folder.id === id ? { ...folder, title: data.title } : folder,
                ),
              };
            }

            // bookmark changed
            const bookmark = prev.bookmarks.find((bookmark) => bookmark.id === id);

            if (bookmark) {
              return {
                bookmarks: prev.bookmarks.map((bookmark) =>
                  bookmark.id === id
                    ? { ...bookmark, title: data.title, url: data.url ?? bookmark.url }
                    : bookmark,
                ),
              };
            }

            return {};
          });
        });
        browser.bookmarks.onMoved.addListener((id, data) => {
          if (get().isImporting) {
            return;
          }

          set((prev) => {
            // folder moved
            const folder = prev.folders.find((folder) => folder.id === id);

            if (folder) {
              return {
                folders: prev.folders.map((folder) =>
                  folder.id === id ? { ...folder, parentId: data.parentId } : folder,
                ),
              };
            }

            // bookmark moved
            const bookmark = prev.bookmarks.find((bookmark) => bookmark.id === id);

            if (bookmark) {
              return {
                bookmarks: prev.bookmarks.map((bookmark) =>
                  bookmark.id === id ? { ...bookmark, folderId: data.parentId } : bookmark,
                ),
              };
            }

            return {};
          });
        });

        set({ isListenerIntialized: true });
      }
    };

    try {
      // init listeners
      initListeners();

      // load data
      const data = await getBookmarks();
      set({ folders: data.folders, bookmarks: data.bookmarks });
    } catch (err: unknown) {
      console.log("Error fetching bookmarks: ", err);
    }
  },
}));
