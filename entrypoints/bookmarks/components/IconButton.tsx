import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  danger?: boolean;
  className?: string;
  onClick: (e: React.MouseEvent) => void;
}

const IconButton = ({ title, children, danger, className, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={title}
      title={title}
      className={` ${className ?? "text-ink-muted/50 dark:text-paper-muted/40 hidden shrink-0 rounded p-1 group-hover:block"} ${
        danger ? "hover:text-red-500" : "hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
};

export default IconButton;
