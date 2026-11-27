import { llmsSummary } from "@/lib/llms";

/** Markdown summary for AI crawlers (llmstxt.org), prerendered at build. */
export function GET() {
  return new Response(llmsSummary(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
