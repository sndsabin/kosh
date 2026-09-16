import { createBookmark, createFolder } from "./bookmark";

const NODE_BOOKMARK = "bookmark";
const NODE_FOLDER = "folder";

type ImportNode =
  | {
      type: typeof NODE_FOLDER;
      title: string;
      children: ImportNode[];
    }
  | {
      type: typeof NODE_BOOKMARK;
      title: string;
      url: string;
    };

function parseBookmarkHtml(html: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  const root = document.querySelector("DL");

  if (!root) {
    throw new Error("Invalid bookmarks HTML file");
  }

  return parseDl(root);
}

function parseDl(element: Element) {
  const nodes: ImportNode[] = [];

  for (const item of Array.from(element.children)) {
    if (item.tagName !== "DT") {
      continue;
    }

    const anchor = item.querySelector(":scope > A");

    if (anchor) {
      const url = anchor.getAttribute("HREF");

      if (!url) {
        continue;
      }

      nodes.push({
        type: NODE_BOOKMARK,
        title: anchor.textContent?.trim() ?? "",
        url: url,
      });

      continue;
    }

    const heading = item.querySelector(":scope > H3");

    if (!heading) {
      continue;
    }

    const childDL = item.querySelector(":scope > DL");

    nodes.push({
      type: NODE_FOLDER,
      title: heading.textContent?.trim() ?? "",
      children: childDL ? parseDl(childDL) : [],
    });
  }

  return nodes;
}

async function createBookmarks(nodes: ImportNode[], parentId: string) {
  for (const node of nodes) {
    if (node.type === NODE_BOOKMARK) {
      await createBookmark(node.title, node.url, parentId);
    } else if (node.type === NODE_FOLDER) {
      const folder = await createFolder(node.title, parentId);

      if (!folder) {
        continue;
      }

      await createBookmarks(node.children, folder.id);
    }
  }
}

export async function importBookmarks(file: File) {
  const html = await file.text();

  const nodes = parseBookmarkHtml(html);

  const importFolder = await createFolder("Imported Bookmarks");

  if (!importFolder) {
    return;
  }

  await createBookmarks(nodes, importFolder.id);
}
