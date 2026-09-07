import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "hello@shabbirk.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "site@shabbirk.com";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are all required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Fails loudly in dev if the env var hasn't been set yet, instead of
      // silently pretending the email sent.
      console.error("RESEND_API_KEY is not set.");
      return NextResponse.json(
        { error: "Email is not configured on the server yet." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `Studio Contact Form <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Couldn't send that — try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
