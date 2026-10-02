import { FolderIcon } from "lucide-react";
import { useBookmarkStore } from "../store/bookmarkStore";

interface Props {
  folderId: string;
  className?: string;
}

const FolderPath = ({ folderId, className = "" }: Props) => {
  const path = useBookmarkStore((state) => state.foldersPath.get(folderId));

  if (!path) {
    return null;
  }

  let truncatedPath = path;
  const splittedPath = path.split("/");

  if (splittedPath.length > 2) {
    truncatedPath = `${splittedPath[0]}/.../${splittedPath[splittedPath.length - 1]}`;
  }

  return (
    <span title={path} className={`flex min-w-0 items-center gap-1 ${className}`}>
      <FolderIcon size={14} className="shrink-0" />
      <span className="translate-y-[1px] truncate">{truncatedPath}</span>
    </span>
  );
};

export default FolderPath;
