import { useState } from "react";
import { ChevronRight, FolderPlus, Pencil, Trash2 } from "lucide-react";

import { useBookmarkStore } from "../store/bookmarkStore";
import { useDashboardStore } from "../store/dashboardStore";

import { moveBookmark } from "@/lib/bookmark";

import IconButton from "./IconButton";

import {
  ACTION_CREATE_FOLDER,
  ACTION_RENAME_FOLDER,
  ALL_BOOKMARKS_FOLDER,
  DRAG_TYPE_BOOKMARK,
  DRAG_TYPE_FOLDER,
  KEY_ENTER,
  KEY_ESCAPE,
} from "@/constants";

import type { FolderTreeNode } from "@/types";

interface Props {
  node: FolderTreeNode;
  depth: number;
}

interface NewFolderState {
  name: string;
  parentId: string;
}

interface RenameFolderState {
  id: string;
  originalName: string;
  newName: string;
}

const SidebarItem = ({ node, depth }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [renameFolderDraft, setRenameFolderDraft] = useState<RenameFolderState>({
    id: "",
    originalName: "",
    newName: "",
  });
  const [newFolderDraft, setNewFolderDraft] = useState<NewFolderState>({
    name: "",
    parentId: "",
  });

  const setError = useDashboardStore((state) => state.setError);
  const isSelected = useDashboardStore((state) => state.selectedFolder.id === node.id);
  const setSelectedFolder = useDashboardStore((state) => state.setSelectedFolder);

  const createFolder = useBookmarkStore((store) => store.createFolder);
  const renameFolder = useBookmarkStore((state) => state.renameFolder);
  const moveFolder = useBookmarkStore((state) => state.moveFolder);
  const deleteFolder = useBookmarkStore((state) => state.deleteFolder);

  const indent = 12 + depth * 16;
  const hasChildren = node.children.length > 0;
  const isDraggedOver = dragOverId === node.id;
  const isRenaming = renameFolderDraft.id !== "";

  const handleCreateNewFolder = async () => {
    const trimmedName = newFolderDraft.name.trim();
    const parentId = newFolderDraft.parentId;

    if (!parentId || !trimmedName) {
      cancelNewFolderCreation();
      return;
    }

    try {
      await createFolder(trimmedName, parentId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      cancelNewFolderCreation();
    }
  };

  const cancelNewFolderCreation = () => {
    setNewFolderDraft({ name: "", parentId: "" });
  };

  const handleRename = async () => {
    const id = renameFolderDraft.id;
    const trimmedName = renameFolderDraft.newName.trim();

    if (!trimmedName || !id || trimmedName === renameFolderDraft.originalName) {
      setRenameFolderDraft({ id: "", originalName: "", newName: "" });
      return;
    }

    try {
      await renameFolder(id, trimmedName);
      isSelected && setSelectedFolder(id, trimmedName); // to reflect title change in header
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRenameFolderDraft({ id: "", originalName: "", newName: "" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: string) => {
    if (e.key === KEY_ENTER) {
      switch (action) {
        case ACTION_RENAME_FOLDER:
          handleRename();
          break;
        case ACTION_CREATE_FOLDER:
          handleCreateNewFolder();
          break;
        default:
          break;
      }
    }

    if (e.key === KEY_ESCAPE) {
      switch (action) {
        case ACTION_RENAME_FOLDER:
          setRenameFolderDraft({
            id: "",
            originalName: "",
            newName: "",
          });
          break;
        case ACTION_CREATE_FOLDER:
          cancelNewFolderCreation();
          break;
        default:
          break;
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, action: string) => {
    e.stopPropagation();

    switch (action) {
      case ACTION_RENAME_FOLDER:
        handleRename();
        break;
      case ACTION_CREATE_FOLDER:
        handleCreateNewFolder();
        break;
      default:
        break;
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);

    const draggedFolderId = e.dataTransfer.getData(DRAG_TYPE_FOLDER);
    const draggedBookmarkID = e.dataTransfer.getData(DRAG_TYPE_BOOKMARK);

    try {
      if (draggedFolderId && targetId) {
        await moveFolder(draggedFolderId, targetId);
      }

      if (draggedBookmarkID && targetId) {
        await moveBookmark(draggedBookmarkID, targetId);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      {isRenaming ? (
        <div style={{ paddingLeft: indent }} className="py-1 pr-3">
          <input
            autoFocus
            id={`rename-folder-${renameFolderDraft.id}`}
            value={renameFolderDraft.newName}
            onChange={(e) => setRenameFolderDraft((prev) => ({ ...prev, newName: e.target.value }))}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={(e) => handleKeyDown(e, ACTION_RENAME_FOLDER)}
            onBlur={(e) => handleBlur(e, ACTION_RENAME_FOLDER)}
            className="border-accent/40 bg-surface dark:bg-night-elevated w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
          />
        </div>
      ) : (
        <div
          role="button"
          draggable
          title={node.title}
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData(DRAG_TYPE_FOLDER, node.id);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverId(node.id);
          }}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(e) => handleDrop(e, node.id)}
          onClick={() => setSelectedFolder(node.id, node.title)}
          style={{ paddingLeft: indent }}
          className={`group flex cursor-pointer items-center justify-between rounded-xl py-2 pr-1.5 text-sm font-medium transition-colors ${
            isSelected
              ? "bg-accent/15 text-accent-strong dark:bg-accent/20 dark:textExpanded-accent-light"
              : "text-ink/75 hover:bg-ink/5 dark:text-paper/75 dark:hover:bg-white/5"
          } ${isDraggedOver ? "ring-accent/50 ring-2" : ""}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((prev) => !prev);
                }}
                aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
                className="text-ink-muted dark:text-paper-muted shrink-0"
              >
                <ChevronRight
                  size={13}
                  style={{
                    transform: isExpanded ? "rotate(90deg)" : "none",
                    transition: "transform 120ms",
                  }}
                />
              </button>
            ) : (
              <span className="w-[13px] shrink-0" />
            )}
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: node.color }}
            />
            <span className="truncate">{node.title}</span>
          </span>
          <span className="flex shrink-0 items-center gap-0.5">
            <IconButton
              title={`Add subfolder inside ${node.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                setNewFolderDraft((prev) => ({ ...prev, parentId: node.id }));
              }}
            >
              <FolderPlus size={13} />
            </IconButton>

            <IconButton
              title={`Rename ${node.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setRenameFolderDraft({
                  id: node.id,
                  originalName: node.title,
                  newName: node.title,
                });
              }}
            >
              <Pencil size={13} />
            </IconButton>

            <IconButton
              title={`Delete ${node.title}`}
              danger
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete "${node.title}" and everything inside it?`)) {
                  deleteFolder(node.id).catch((err: unknown) =>
                    setError(err instanceof Error ? err.message : String(err)),
                  );
                  isSelected && setSelectedFolder(ALL_BOOKMARKS_FOLDER, ALL_BOOKMARKS_FOLDER); // reset header title if the folder was selected
                }
              }}
            >
              <Trash2 size={13} />
            </IconButton>
          </span>
        </div>
      )}

      {hasChildren && isExpanded && (
        <>
          {node.children.map((childNode) => {
            return <SidebarItem key={childNode.id} node={childNode} depth={depth + 1} />;
          })}
        </>
      )}

      {newFolderDraft?.parentId === node.id && (
        <div style={{ paddingLeft: 16 + (depth + 1) * 18 }} className="py-1 pr-3">
          <input
            autoFocus
            id="add-new-folder"
            value={newFolderDraft.name ?? ""}
            onChange={(e) => setNewFolderDraft((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, ACTION_CREATE_FOLDER)}
            onBlur={(e) => handleBlur(e, ACTION_CREATE_FOLDER)}
            placeholder="Folder name"
            className="border-accent/40 bg-surface dark:bg-night-elevated w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
          />
        </div>
      )}
    </>
  );
};

export default SidebarItem;
