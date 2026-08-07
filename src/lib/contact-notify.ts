import { Resend } from "resend";
import type { ContactPayload } from "@/lib/validate-contact";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function notifyContactSubmission(payload: ContactPayload) {
  const subject = `Նոր հայտ Bayazet Hall կայքից՝ ${payload.name}`;

  console.log("[contact]", {
    subject,
    ...payload,
    receivedAt: new Date().toISOString(),
  });

  const html = `
    <h2>${escapeHtml(subject)}</h2>
    <p><strong>Անուն:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Հեռախոս:</strong> ${escapeHtml(payload.phone)}</p>
    <p><strong>Էլ. հասցե:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Հաղորդագրություն:</strong></p>
    <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
  `.trim();

  // recipient is the only visible "to"; recipient2 (if set) is bcc'd
  // silently — it must never appear in a to/cc header. reply-to is the
  // submitter's own address, so a staff member replying from their mail
  // client goes straight back to the customer instead of the unmonitored
  // no-reply sender.
  const { error } = await resend.emails.send({
    from: "no-reply@bayazethall.am",
    to: process.env.CONTACT_FORM_RECIPIENT!,
    bcc: process.env.CONTACT_FORM_RECIPIENT2,
    replyTo: payload.email,
    subject,
    html,
  });

  if (error) {
    // Resend's SDK returns { error } rather than throwing — re-throw so the
    // route's existing try/catch treats this as a failed submission instead
    // of silently reporting success.
    throw new Error(`Resend failed to send contact notification: ${error.message}`);
  }
}
