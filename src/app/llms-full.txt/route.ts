import { llmsFull } from "@/lib/llms";

/** Every published article in full, as Markdown, prerendered at build. */
export function GET() {
  return new Response(llmsFull(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
