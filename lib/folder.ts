import { browser } from "wxt/browser";
import type { Folder, FolderTreeNode } from "@/types";

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

export function getFolderSubtreeIds(id: string, folders: Folder[]) {
  const ids: string[] = [];
  const folderTree = buildFolderTree(folders);

  const walk = (nodes: FolderTreeNode[]) => {
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
  };

  const collect = (node: FolderTreeNode) => {
    if (node.id) {
      ids.push(node.id);
    }

    for (const child of node.children) {
      collect(child);
    }
  };

  walk(folderTree);

  return ids;
}

export function buildFoldersPath(folders: Folder[]) {
  const foldersById = new Map<string, Folder>();

  folders.forEach((folder) => {
    foldersById.set(folder.id, folder);
  });

  const paths = new Map<string, string>();

  const buildPath = (folder: Folder): string => {
    const cached = paths.get(folder.id);

    if (cached !== undefined) {
      return cached;
    }

    const parentFolder = folder.parentId ? foldersById.get(folder.parentId) : null;

    const parentPath = parentFolder ? buildPath(parentFolder) : "";
    const path = parentPath ? `${parentPath}/${folder.title}` : folder.title;

    paths.set(folder.id, path);

    return path;
  };

  folders.forEach((folder) => {
    buildPath(folder);
  });

  return paths;
}
