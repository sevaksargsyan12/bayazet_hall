import { NextResponse } from "next/server";
import { notifyContactSubmission } from "@/lib/contact-notify";
import { validateContactPayload, type ContactPayload } from "@/lib/validate-contact";

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  const fieldErrors = validateContactPayload(body);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { ok: false, error: "validation", fieldErrors },
      { status: 400 }
    );
  }

  try {
    await notifyContactSubmission({
      name: body.name!.trim(),
      phone: body.phone!.trim(),
      email: body.email!.trim(),
      message: body.message!.trim(),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
