import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const SettingItem = ({ title, description, children }: Props) => {
  return (
    <div className="flex items-center justify-between gap-6 py-5 first:pt-0">
      <div className="min-w-0">
        <p className="text-ink dark:text-paper text-sm font-medium">{title}</p>
        <p className="text-ink-muted dark:text-paper-muted mt-0.5 text-xs">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default SettingItem;
