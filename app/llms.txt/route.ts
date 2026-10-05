import { brand, offer } from "@/content/site";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${brand.name}`,
    "",
    `> ${brand.description}`,
    "",
    "## What we make",
    ...offer.services.map((s) => `- ${s.title}: ${s.body}`),
    "",
    "## Pages",
    `- [Home](${siteUrl}/)`,
    `- [Enquire](${siteUrl}/contact)`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
