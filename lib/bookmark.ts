import { browser } from "wxt/browser";

import { getColor } from "./color";

import type { Browser } from "#imports";
import type { Bookmark, Folder } from "@/types";

export async function getBookmarks() {
  const bookmarkNodes = await browser.bookmarks.getTree();

  const folders: Folder[] = [];
  const bookmarks: Bookmark[] = [];

  const parseBookmark = (node: Browser.bookmarks.BookmarkTreeNode) => {
    const isFolder = node.url === undefined;

    if (isFolder) {
      folders.push({
        id: node.id,
        parentId: node.parentId,
        title: node.title,
        color: getColor(node.id),
        createdAt: node.dateAdded ?? Date.now(),
      });
    }

    if (!node.children) {
      bookmarks.push({
        id: node.id,
        folderId: node.parentId ?? "0",
        url: node.url!,
        title: node.title,
        createdAt: node.dateAdded ?? Date.now(),
      });
    }

    node.children?.forEach((child) => parseBookmark(child));
  };

  bookmarkNodes
    .flatMap((root) => root.children ?? []) // skip the root node
    .forEach((bookmark) => {
      parseBookmark(bookmark);
    });

  return {
    folders: folders,
    bookmarks: bookmarks,
  };
}

export function createBookmark(name: string, url: string, parentId: string) {
  if (!parentId || !name || !url) {
    return;
  }

  return browser.bookmarks.create({
    title: name,
    url: url,
    parentId: parentId,
  });
}

export function deleteBookmark(id: string) {
  if (!id) {
    return;
  }

  return browser.bookmarks.remove(id);
}

export function moveBookmark(id: string, parentId: string) {
  if (!id || !parentId) {
    return;
  }

  return browser.bookmarks.move(id, { parentId: parentId });
}

export function getBookmarksByFolder(bookmarks: Bookmark[]) {
  const bookmarkMap = new Map<string, Bookmark[]>();

  bookmarks.forEach((bookmark) => {
    const item = bookmarkMap.get(bookmark.folderId);

    if (item) {
      item.push(bookmark);
    } else {
      bookmarkMap.set(bookmark.folderId, [bookmark]);
    }
  });

  return bookmarkMap;
}

export function findDuplicates(bookmarks: Bookmark[]) {
  const duplicates: Bookmark[] = [];
  const bookmarkMap = new Map<string, Bookmark[]>();

  bookmarks.forEach((item) => {
    try {
      const url = new URL(item.url).href.replace(/^www\./, "").toLowerCase();
      const bookmark = bookmarkMap.get(url);

      if (bookmark) {
        bookmark.push(item);
      } else {
        bookmarkMap.set(url, [item]);
      }
    } catch (err) {
      console.error("something went wrong while finding duplicates: ", err);
    }
  });

  bookmarkMap.forEach((bookmark) => {
    if (bookmark.length > 1) {
      duplicates.push(...bookmark);
    }
  });

  return duplicates;
}
