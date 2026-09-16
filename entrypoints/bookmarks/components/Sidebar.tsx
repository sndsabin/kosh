import { Link } from "react-router-dom";
import { Copy, Info, Settings } from "lucide-react";

import { useBookmarkStore } from "../store/bookmarkStore";

import logo from "@/assets/logo.svg";

import { useDashboardStore } from "../store/dashboardStore";
import { buildFolderTree, findDuplicates } from "@/lib/bookmark";

import SidebarItem from "./SidebarItem";

import { ALL_BOOKMARKS_FOLDER, DUPLICATES_FOLDER } from "@/constants";

interface Props {
  title: string;
}

const Sidebar = ({ title }: Props) => {
  const folders = useBookmarkStore((state) => state.folders);
  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  const selectedFolder = useDashboardStore((state) => state.selectedFolder);
  const setSelectedFolder = useDashboardStore((state) => state.setSelectedFolder);

  const folderTreeNode = useMemo(() => {
    return buildFolderTree(folders);
  }, [folders]);

  const duplicates = useMemo(() => {
    return findDuplicates(bookmarks);
  }, [bookmarks]);

  const duplicateCount = duplicates.length;

  return (
    <aside className="border-surface-border bg-surface-alt dark:border-night-border dark:bg-night-surface flex h-full w-84 shrink-0 flex-col justify-between border-r px-3 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 px-2 pb-6">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <img src={logo} alt="logo" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{title}</span>
        </div>

        <nav className="flex max-h-[calc(100vh-9rem)] scrollbar-thin flex-col gap-0.5 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedFolder(ALL_BOOKMARKS_FOLDER, ALL_BOOKMARKS_FOLDER)}
            className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              selectedFolder.id === ALL_BOOKMARKS_FOLDER
                ? "bg-accent/15 text-accent-strong dark:bg-accent/20 dark:text-accent-light"
                : "text-ink/75 hover:bg-ink/5 dark:text-paper/75 dark:hover:bg-white/5"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
              <span className="truncate">All Bookmarks</span>
            </span>
            <span className={`text-xs tabular-nums`}>{bookmarks.length}</span>
          </button>

          {duplicateCount > 0 && (
            <button
              onClick={() => setSelectedFolder(DUPLICATES_FOLDER, DUPLICATES_FOLDER)}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                selectedFolder.id === DUPLICATES_FOLDER
                  ? "bg-accent/15 text-accent-strong dark:bg-accent/20 dark:text-accent-light"
                  : "text-ink/75 hover:bg-ink/5 dark:text-paper/75 dark:hover:bg-white/5"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <Copy size={13} strokeWidth={2} />
                <span className="truncate">Duplicates</span>
              </span>
              <span className="text-ink-muted/60 dark:text-paper-muted/50 text-xs tabular-nums">
                {duplicateCount}
              </span>
            </button>
          )}

          <div className="mt-5 mb-1 flex items-center justify-between px-3">
            <p className="text-ink-muted/70 dark:text-paper-muted/50 text-xs font-medium tracking-wide uppercase">
              Folders
            </p>
          </div>

          {folderTreeNode.map((folderNode) => (
            <SidebarItem key={folderNode.id} node={folderNode} depth={0} />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-0.5">
        <Link
          to="/settings"
          className="text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper-muted dark:hover:text-paper flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors dark:hover:bg-white/5"
        >
          <Settings size={16} strokeWidth={2} className="shrink-0" />
          Settings
        </Link>
        <Link
          to="/about"
          className="text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper-muted dark:hover:text-paper flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors dark:hover:bg-white/5"
        >
          <Info size={16} strokeWidth={2} className="shrink-0" />
          About
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
