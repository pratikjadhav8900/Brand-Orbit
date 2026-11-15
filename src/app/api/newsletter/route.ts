import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { assertEmail, isSpam, FormValidationError } from "@/lib/formSubmission";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isSpam(body)) {
      return NextResponse.json({ ok: true });
    }

    const email = assertEmail(body.email);

    const db = getAdminDb();
    await db.collection("newsletterSubscribers").doc(email).set({
      email,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof FormValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("newsletter signup failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't subscribe you right now. Please try again later." },
      { status: 500 }
    );
  }
}
