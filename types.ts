import {
  SORT_MODE_ALPHABETIC,
  SORT_MODE_OLDEST,
  SORT_MODE_RECENT,
  VIEW_MODE_GRID,
  type THEME_MODE_DARK,
  type THEME_MODE_LIGHT,
  type VIEW_MODE_LIST,
} from "./constants";

export interface Folder {
  id: string;
  parentId: string | undefined;
  title: string;
  color: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  folderId: string;
  url: string;
  title: string;
  createdAt: number;
}

export interface BookmarkData {
  folders: Folder[];
  bookmarks: Bookmark[];
}

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
}

export type Theme = typeof THEME_MODE_LIGHT | typeof THEME_MODE_DARK;
export type ViewMode = typeof VIEW_MODE_LIST | typeof VIEW_MODE_GRID;
export type SortMode =
  typeof SORT_MODE_RECENT | typeof SORT_MODE_OLDEST | typeof SORT_MODE_ALPHABETIC;
