import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Loader2, Moon, Sun, Upload } from "lucide-react";

import { exportBookmarks } from "@/lib/export";

import Switch from "../components/Switch";
import SettingItem from "../components/SettingItem";

import { THEME_MODE_DARK, THEME_MODE_LIGHT } from "@/constants";

import type { Theme } from "@/types";
import useBanner from "@/hooks/useBanner";
import { importBookmarks } from "@/lib/import";
import { refreshBookmarkData, useBookmarkStore } from "../store/bookmarkStore";

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

const Settings = ({ theme, onToggleTheme }: Props) => {
  const navigate = useNavigate();
  const { showBanner, toggleBanner } = useBanner();
  const [error, setError] = useState<string | null>(null);

  const isImporting = useBookmarkStore((store) => store.isImporting);
  const setIsImporting = useBookmarkStore((store) => store.setIsImporting);

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col px-6 py-8">
      <Link
        to="/"
        className="text-ink-muted hover:text-ink dark:text-paper-muted dark:hover:text-paper mb-8 flex w-fit items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      <p className="text-ink-muted dark:text-paper-muted mt-1 text-sm">Available configurations</p>

      <div className="divide-surface-border dark:divide-night-border mt-8 flex flex-col divide-y">
        <SettingItem title="Appearance" description="Switch between light and dark mode.">
          <button
            onClick={() => onToggleTheme()}
            className="border-surface-border text-ink-muted hover:text-ink dark:border-night-border dark:text-paper-muted dark:hover:text-paper flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
          >
            {theme === THEME_MODE_DARK ? <Sun size={16} /> : <Moon size={16} />}
            {theme === THEME_MODE_DARK ? THEME_MODE_LIGHT : THEME_MODE_DARK}
          </button>
        </SettingItem>

        <SettingItem title="Show support banner" description="Switch to hide the support banner.">
          <Switch checked={showBanner} onChange={toggleBanner} label="Show support banner." />
        </SettingItem>

        <SettingItem
          title="Export bookmarks"
          description={`Download all bookmarks as an .html file.`}
        >
          <button
            onClick={() => {
              exportBookmarks().catch((err: unknown) => {
                setError(err instanceof Error ? err.message : String(err));
              });
            }}
            className="border-surface-border text-ink-muted hover:text-ink dark:border-night-border dark:text-paper-muted dark:hover:text-paper flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </SettingItem>

        <SettingItem title="Import bookmarks" description={`Import bookmarks (.html supported)`}>
          <label className="border-surface-border text-ink-muted hover:text-ink dark:border-night-border dark:text-paper-muted dark:hover:text-paper flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors">
            {isImporting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Importing
              </>
            ) : (
              <>
                <Upload size={16} /> Import
              </>
            )}
            <input
              type="file"
              disabled={isImporting ? true : false}
              accept=".html"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) {
                  return;
                }

                setIsImporting(true);

                importBookmarks(file)
                  .then(() => {
                    navigate("/");
                  })
                  .catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : String(err));
                  })
                  .finally(() => {
                    // sync as we have turned off listener while import
                    refreshBookmarkData();
                    setIsImporting(false);
                  });
              }}
            />
          </label>
        </SettingItem>
      </div>

      <div className="relative z-99">
        {error && <ErrorAlert message={error} className="mx-4" />}
      </div>
    </div>
  );
};

export default Settings;
