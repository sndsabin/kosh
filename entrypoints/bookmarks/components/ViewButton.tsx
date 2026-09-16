import type { ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const ViewButton = ({ label, icon, isActive, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
      className={`rounded-full p-1.5 transition-colors ${
        isActive
          ? "bg-accent/15 text-accent-strong dark:bg-accent/20 dark:text-accent-light"
          : "text-ink-muted hover:text-ink dark:text-paper-muted dark:hover:text-paper"
      }`}
    >
      {icon}
    </button>
  );
};

export default ViewButton;
