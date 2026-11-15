import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { assertEmail, assertRequiredString, isSpam, FormValidationError } from "@/lib/formSubmission";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isSpam(body)) {
      return NextResponse.json({ ok: true });
    }

    const name = assertRequiredString(body.name, "Name", 200);
    const email = assertEmail(body.email);
    const role = assertRequiredString(body.role, "Role of interest", 200);
    const links = typeof body.links === "string" ? body.links.trim().slice(0, 500) : "";
    const message = assertRequiredString(body.message, "Message", 5000);

    const db = getAdminDb();
    await db.collection("careerApplications").add({
      name,
      email,
      role,
      links,
      message,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof FormValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("career application failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't submit this right now. Please email us directly." },
      { status: 500 }
    );
  }
}
