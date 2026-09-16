const dateFromater = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatTitle(title: string): string {
  return title.replace(/[_]/g, " ");
}

export function formatDate(timestamp: number): string {
  return dateFromater.format(new Date(timestamp));
}

export function escapeHtml(val: string) {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function msToSec(val: number) {
  return Math.floor(val / 1000);
}
