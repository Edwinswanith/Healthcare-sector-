"use client";

import { useState } from "react";
import { submitEnquiry, type Enquiry, type EnquiryResult } from "@/lib/enquiry/adapter";

const INTERESTS = ["A new website", "Patient films", "An AI presenter", "Social content"];
type Errors = Partial<Record<"name" | "email" | "website", string>>;

export function EnquiryForm({ initialInterest, initialSpecialty, initialTopic }: { initialInterest?: string; initialSpecialty?: string; initialTopic?: string }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<EnquiryResult | null>(null);
  const preInterest = initialInterest === "films" ? "Patient films" : initialInterest === "website" ? "A new website" : undefined;

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (busy) return;
    const f = new FormData(ev.currentTarget);
    if (f.get("company_fax")) return; // honeypot
    const data: Enquiry = {
      name: String(f.get("name") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      organisation: String(f.get("organisation") ?? "").trim(),
      specialty: String(f.get("specialty") ?? "").trim(),
      website: String(f.get("website") ?? "").trim(),
      interests: f.getAll("interest").map(String),
      when: String(f.get("when") ?? "").trim(),
      message: String(f.get("message") ?? "").trim(),
    };
    const e: Errors = {};
    if (!data.name) e.name = "Please tell us your name.";
    if (!data.email) e.email = "Please add an email address so we can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "That email address doesn't look complete.";
    if (data.website && !/^https?:\/\/\S+\.\S+/.test(data.website)) e.website = "Please include the full address, starting with https://";
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      setResult(await submitEnquiry(data));
    } catch (err) {
      setResult({ status: "error", detail: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setBusy(false);
    }
  };

  const field = (id: "name" | "email" | "website") => ({
    id: `f-${id}`,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `e-${id}` : undefined,
  });

  return (
    <form className="enq" noValidate onSubmit={onSubmit} aria-busy={busy}>
      <p className="enq-warn"><strong>Please do not send patient information.</strong> We never need it, for an enquiry or for a film.</p>
      <div className="enq-grid">
        <label>Your name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required {...field("name")} /></label>
        {errors.name ? <p className="err" id="e-name">{errors.name}</p> : null}
        <label>Email <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required {...field("email")} /></label>
        {errors.email ? <p className="err" id="e-email">{errors.email}</p> : null}
        <label>Practice, clinic or hospital<input name="organisation" autoComplete="organization" /></label>
        <label>Specialty<input name="specialty" defaultValue={initialSpecialty} /></label>
        <label>Current website, if you have one<input name="website" type="url" inputMode="url" placeholder="https://" {...field("website")} /></label>
        {errors.website ? <p className="err" id="e-website">{errors.website}</p> : null}
        <fieldset>
          <legend>What are you interested in?</legend>
          {INTERESTS.map((i) => (
            <label key={i} className="check"><input type="checkbox" name="interest" value={i} defaultChecked={i === preInterest} />{i}</label>
          ))}
        </fieldset>
        <label>When is a good time for a call?<input name="when" /></label>
        <label>Anything else we should know<textarea name="message" rows={5} defaultValue={initialTopic ? `I'd like to ask about the film: ${initialTopic}` : undefined} /></label>
        <label className="hp" aria-hidden="true">Leave empty<input name="company_fax" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button className="btn btn--signal" type="submit" disabled={busy}>{busy ? "Preparing…" : "Send enquiry"}</button>
      <div className="enq-status" role="status" aria-live="polite">
        {result?.status === "not-configured" ? (
          <p className="status status--warn"><strong>Nothing was sent.</strong> This form is not connected to an inbox yet. It will be switched on once the enquiry address is confirmed.</p>
        ) : null}
        {result?.status === "handoff" ? (
          <p className="status">Your email app should now be open with the enquiry written out to {result.detail}. It is only sent when you press send there.</p>
        ) : null}
        {result?.status === "sent" ? <p className="status status--ok">Thank you. Your enquiry has been received.</p> : null}
        {result?.status === "error" ? <p className="status status--warn">Something went wrong and nothing was sent ({result.detail}). Please try again.</p> : null}
      </div>
    </form>
  );
}
