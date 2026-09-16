import { CircleAlert, RefreshCw } from "lucide-react";

interface Props {
  error?: string;
  onRetry?: () => void;
}

const ErrorScreen = ({ error, onRetry }: Props) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[420px] items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-[#0ea5e9] dark:bg-sky-500/10">
          <CircleAlert className="h-8 w-8" strokeWidth={1.8} />
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Something went sideways. Your bookmarks are still safe.
        </h2>

        {error && (
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0ea5e9] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0284c7] focus:ring-2 focus:ring-[#0ea5e9]/40 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-slate-900"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
