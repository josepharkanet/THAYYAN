import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/** Render trusted Markdown (seed/admin-authored) to an HTML string. */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
