import Link from "next/link";
import type { Metadata } from "next";
import { Eyebrow, Headline } from "@/components/ui/Headline";
import { EnquiryForm } from "./EnquiryForm";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Tell us your specialty and what you would like handled: website, patient films, an AI presenter or social content.",
  alternates: { canonical: "/contact/" },
};

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Contact({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  return (
    <main id="main" className="contact" data-theme="paper" tabIndex={-1}>
      <div className="contact-head">
        <p className="mono crumb"><Link href="/">Home</Link> / Contact</p>
        <Eyebrow>Enquire</Eyebrow>
        <Headline h={{ lead: ["Start with a"], accent: "short call." }} as="h1" />
        <p className="body-l">Tell us your specialty and what you would like handled. We come back with a time to talk, and after the call a suggested plan and a quote.</p>
        <ol className="next mono">
          <li>A short call about your practice and patients.</li>
          <li>A suggested plan: pages, film topics and channels, with a quote.</li>
          <li>Scripts and designs for your review before anything is produced.</li>
        </ol>
      </div>
      <EnquiryForm initialInterest={one("interest")} initialSpecialty={one("specialty")} initialTopic={one("topic")} />
    </main>
  );
}
