import type { ContactPayload } from "@/lib/validate-contact";

export async function notifyContactSubmission(payload: ContactPayload) {
  const subject = `Նոր հայտ Bayazet Hall կայքից՝ ${payload.name}`;

  console.log("[contact]", {
    subject,
    ...payload,
    receivedAt: new Date().toISOString(),
  });

  // TODO(email): wire a real provider here (e.g. Resend) once credentials exist.
}
