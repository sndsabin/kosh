import { Check, Copy, Trash2 } from "lucide-react";

import { getColor } from "@/lib/color";
import { getFaviconUrl } from "@/lib/image";
import { formatDate } from "@/lib/formatter";
import { getDomainLabel, getHostName } from "@/lib/url";

import { DRAG_TYPE_BOOKMARK } from "@/constants";

import type { Bookmark } from "@/types";

interface Props {
  bookmark: Bookmark;
  copied: boolean;
  selected: boolean;
  duplicate: boolean;
  onDelete: (id: string) => void;
  onCopy: (bookmark: Bookmark) => void;
  onToggleSelect: (id: string) => void;
}

const BookmarkListItem = ({
  bookmark,
  copied,
  selected,
  duplicate,
  onDelete,
  onCopy,
  onToggleSelect,
}: Props) => {
  const color = getColor(bookmark.folderId);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE_BOOKMARK, bookmark.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => window.open(bookmark.url, "_blank", "noopener,noreferrer")}
      className="group hover:bg-accent/[0.06] flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors"
    >
      <label onClick={(e) => e.stopPropagation()} className="flex shrink-0 items-center">
        <input
          type="checkbox"
          id="select-bookmark"
          checked={selected}
          onChange={() => onToggleSelect(bookmark.id)}
          className="accent-accent h-3.5 w-3.5"
        />
      </label>
      <img
        src={getFaviconUrl(bookmark.url, 32)}
        alt=""
        className="h-6 w-6 shrink-0 rounded-md"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
      <span className="text-ink group-hover:text-accent-strong dark:text-paper dark:group-hover:text-accent-light min-w-0 flex-1 truncate text-sm">
        {bookmark.title}
      </span>
      {duplicate && (
        <span className="hidden shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600 sm:block dark:text-amber-400">
          Duplicate
        </span>
      )}
      <span className="text-ink-muted dark:text-paper-muted hidden truncate text-xs sm:block">
        {getHostName(bookmark.url)}
      </span>
      <span
        className="hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-medium md:block"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        #{getDomainLabel(bookmark.url)}
      </span>

      <span className="text-ink-muted/70 dark:text-paper-muted/60 hidden shrink-0 text-[11px] lg:block">
        {formatDate(bookmark.createdAt)}
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(bookmark);
          }}
          aria-label="Copy link"
          className="text-ink-muted/70 hover:bg-ink/5 hover:text-accent dark:text-paper-muted/60 rounded p-1 transition-colors dark:hover:bg-white/5"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          aria-label="Delete bookmark"
          className="text-ink-muted/70 dark:text-paper-muted/60 rounded p-1 transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default BookmarkListItem;
