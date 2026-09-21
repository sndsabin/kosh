import { useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

import { getColor } from "@/lib/color";
import { formatDate } from "@/lib/formatter";
import { getDomainLabel, getHostName } from "@/lib/url";
import { getFaviconUrl, getThumbnail } from "@/lib/image";

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

const BookmarkCard = ({
  bookmark,
  copied,
  selected,
  duplicate,
  onDelete,
  onCopy,
  onToggleSelect,
}: Props) => {
  const [imgFailed, setImgFailed] = useState(false);

  const color = getColor(bookmark.folderId);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE_BOOKMARK, bookmark.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => window.open(bookmark.url, "_blank", "noopener,noreferrer")}
      className="group rounded-card border-surface-border bg-surface hover:border-accent/40 dark:border-night-border dark:bg-night-surface flex cursor-pointer flex-col overflow-hidden border transition-all hover:shadow-[0_10px_28px_-14px_rgba(139,92,246,0.4)]"
    >
      <div className="bg-surface-alt dark:bg-night-elevated relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        {!imgFailed ? (
          <img
            src={getThumbnail(bookmark.url)}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}26, ${color}08)` }}
          >
            <img
              src={getFaviconUrl(bookmark.url, 64)}
              alt=""
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
        )}

        <label
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 has-[:checked]:opacity-100"
        >
          <input
            type="checkbox"
            id={`select-bookmark-${bookmark.id}`}
            checked={selected}
            onChange={() => onToggleSelect(bookmark.id)}
            className="accent-accent h-3.5 w-3.5"
          />
        </label>

        {duplicate && (
          <span className="absolute top-2 right-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
            Duplicate
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-center gap-2">
          <img
            src={getFaviconUrl(bookmark.url, 32)}
            alt=""
            className="h-4 w-4 shrink-0 rounded-sm"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <p className="text-ink dark:text-paper truncate text-sm font-medium">{bookmark.title}</p>
        </div>

        <div className="text-ink-muted dark:text-paper-muted flex items-center gap-2 overflow-hidden text-xs">
          <span className="truncate">{getHostName(bookmark.url)}</span>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: `${color}1A`, color }}
          >
            #{getDomainLabel(bookmark.url)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-ink-muted/70 dark:text-paper-muted/60 text-[11px]">
            {formatDate(bookmark.createdAt) ?? ""}
          </span>
          <div className="flex items-center gap-0.5">
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
      </div>
    </div>
  );
};

export default BookmarkCard;
