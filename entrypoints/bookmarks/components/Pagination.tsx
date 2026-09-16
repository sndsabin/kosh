import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}
const Pagination = ({ page, pageSize, total, onPageChange }: Props) => {
  if (total === 0) {
    return;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const canPrev = page > 1;
  const canNext = end < total;

  return (
    <div
      className={`flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 text-[13px] text-slate-500 dark:border-slate-800`}
    >
      <span>
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{start}</span> to{" "}
        <span className="font-medium text-slate-700 dark:text-slate-300">{end}</span> of{" "}
        <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span>
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-[#0284c7] transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-slate-500 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-sky-400 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
