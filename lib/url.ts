import { browser } from "wxt/browser";

export function openUrl(url: string) {
  return browser.tabs.create({ url });
}

export function openDashboard() {
  return browser.tabs.create({ url: "bookmarks.html" });
}

export function getHostName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getDomainLabel(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const domainName = hostname.split(".")[0];

    return domainName && domainName.length > 1 ? domainName : null;
  } catch {
    return null;
  }
}
