export function getFaviconUrl(url: string, size = 32) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return "";
  }
}

export function getThumbnail(url: string, width = 400) {
  return `https://s.wordpress.com/mshots/v1/${url}?w=${width}`;
}
