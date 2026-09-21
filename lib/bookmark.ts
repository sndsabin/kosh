import { browser } from "wxt/browser";

import { getColor } from "./color";

import type { Browser } from "#imports";
import type { Bookmark, Folder, FolderTreeNode } from "@/types";

export async function getBookmarks() {
  const bookmarkNodes = await browser.bookmarks.getTree();

  const folders: Folder[] = [];
  const bookmarks: Bookmark[] = [];

  function parseBookmark(node: Browser.bookmarks.BookmarkTreeNode) {
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
  }

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

export function createFolder(name: string, parentId?: string) {
  if (!name.trim()) {
    return;
  }

  return browser.bookmarks.create({
    parentId: parentId,
    title: name,
  });
}

export function renameFolder(id: string, name: string) {
  if (!id || !name.trim()) {
    return;
  }

  return browser.bookmarks.update(id, { title: name });
}

export function moveFolder(id: string, parentId: string) {
  if (!id || !parentId || id === parentId) {
    return;
  }

  return browser.bookmarks.move(id, { parentId: parentId });
}

export function removeFolder(id: string) {
  if (!id) {
    return;
  }

  return browser.bookmarks.removeTree(id);
}

export function buildFolderTree(folders: Folder[]) {
  const foldersMap = new Map<string, FolderTreeNode>();

  folders.forEach((folder) => {
    foldersMap.set(folder.id, { ...folder, children: [] });
  });

  const data: FolderTreeNode[] = [];

  folders.forEach((folder) => {
    const folderData = foldersMap.get(folder.id)!;
    const parent = folder.parentId ? foldersMap.get(folder.parentId) : null;

    if (parent) {
      parent.children.push(folderData);
    } else {
      data.push(folderData);
    }
  });

  return data;
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

export function getFolderSubtreeIds(id: string, folders: Folder[]) {
  const ids: string[] = [];
  const folderTree = buildFolderTree(folders);

  function walk(nodes: FolderTreeNode[]) {
    for (const node of nodes) {
      if (node.id === id) {
        collect(node);
        return true; // stop searching for folder
      }

      if (walk(node.children)) {
        return true;
      }
    }

    return false;
  }

  function collect(node: FolderTreeNode) {
    if (node.id) {
      ids.push(node.id);
    }

    for (const child of node.children) {
      collect(child);
    }
  }

  walk(folderTree);

  return ids;
}
