// Swappable enquiry destination. The UI only talks to `submitEnquiry`.
// Today: a mailto composer when NEXT_PUBLIC_ENQUIRY_EMAIL is confirmed,
// otherwise an honest "not connected" result. A future API/email adapter
// replaces `pickAdapter` without touching the form.

export type Enquiry = {
  name: string;
  email: string;
  organisation: string;
  specialty: string;
  website: string;
  interests: string[];
  when: string;
  message: string;
};

export type EnquiryResult =
  | { status: "sent" }
  | { status: "handoff"; detail: string }
  | { status: "not-configured" }
  | { status: "error"; detail: string };

type Adapter = (e: Enquiry) => Promise<EnquiryResult>;

function body(e: Enquiry) {
  return [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    e.organisation && `Practice, clinic or hospital: ${e.organisation}`,
    e.specialty && `Specialty: ${e.specialty}`,
    e.website && `Website: ${e.website}`,
    e.interests.length ? `Interested in: ${e.interests.join(", ")}` : "",
    e.when && `Good time for a call: ${e.when}`,
    e.message && `\n${e.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const mailtoAdapter =
  (to: string): Adapter =>
  async (e) => {
    const href = `mailto:${to}?subject=${encodeURIComponent(`Enquiry from ${e.name}`)}&body=${encodeURIComponent(body(e))}`;
    window.location.href = href;
    // We cannot know whether the visitor sends it, so never claim delivery.
    return { status: "handoff", detail: to };
  };

const notConfigured: Adapter = async () => ({ status: "not-configured" });

export function pickAdapter(): Adapter {
  const to = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL?.trim();
  return to ? mailtoAdapter(to) : notConfigured;
}

export const submitEnquiry = (e: Enquiry) => pickAdapter()(e);
