import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import logo from "@/assets/logo.svg";
import { getAppName, getAppVersion } from "@/lib/info";

const About = () => {
  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col px-6 py-8">
      <Link
        to="/"
        className="text-ink-muted hover:text-ink dark:text-paper-muted dark:hover:text-paper mb-8 flex w-fit items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl">
          <img src={logo} alt="logo" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{getAppName()}</h1>
          <p className="text-ink-muted dark:text-paper-muted text-xs">v{getAppVersion()}</p>
        </div>
      </div>

      <p className="text-ink-muted dark:text-paper-muted mt-6 text-sm">
        A minimal bookmark manager to save, organize, tag, and quickly find your favorite web pages.
      </p>

      <div className="rounded-card border-surface-border text-ink-muted dark:border-night-border dark:text-paper-muted mt-8 border p-4 text-xs">
        <p className="text-ink dark:text-paper font-medium">© sndsabin </p>
      </div>
    </div>
  );
};

export default About;
