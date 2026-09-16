import { browser } from "wxt/browser";
import { escapeHtml, formatDate, msToSec } from "./formatter";

const CRLF = "\r\n";

function serializeNode(node: Browser.bookmarks.BookmarkTreeNode, depth = 1) {
  const indent = "    ".repeat(depth);

  const addDate = node.dateAdded ? msToSec(node.dateAdded) : null;

  // bookmark
  if (node.url) {
    const attributes = addDate ? ` ADD_DATE="${addDate}"` : "";

    return `${indent}<DT><A HREF="${escapeHtml(node.url)}"${attributes}>${escapeHtml(node.title)}</A>`;
  }

  // folder
  const lastModified = node.dateGroupModified ? msToSec(node.dateGroupModified) : null;

  const attributes = [
    addDate && `ADD_DATE="${addDate}"`,
    lastModified && `LAST_MODIFIED="${lastModified}"`,
  ]
    .filter(Boolean)
    .join(" ");

  const children: string =
    node.children?.map((child) => serializeNode(child, depth + 1)).join(CRLF) ?? "";

  return [
    `${indent}<DT><H3${attributes ? ` ${attributes}` : ""}>${escapeHtml(node.title)}</H3>`,
    `${indent}<DL><p>`,
    children,
    `${indent}</DL><p>`,
  ].join(CRLF);
}

export async function exportBookmarks() {
  const tree = await browser.bookmarks.getTree();

  const header = [
    "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    "<!-- This is an automatically generated file.",
    " It will be read and overwritten.",
    " DO NOT EDIT! -->",
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    "<TITLE>Bookmarks</TITLE>",
    "<H1>Bookmarks</H1>",
    "<DL><p>",
  ].join(CRLF);

  const body = tree
    .flatMap((root) => root.children ?? []) // skip the root node
    .map((node) => serializeNode(node))
    .join(CRLF);

  const html = [header, body, "</DL><p>"].join(CRLF);

  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  try {
    await browser.downloads.download({
      url,
      filename: `bookmarks-${formatDate(Date.now())}.html`,
      saveAs: true,
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
