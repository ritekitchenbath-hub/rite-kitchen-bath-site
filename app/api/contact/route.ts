import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/validators";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = leadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    const { name, email, phone, message, recaptchaToken } = parsed.data;

    // Server-side reCAPTCHA check if keys exist
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (recaptchaSecret && siteKey) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: "reCAPTCHA required." }, { status: 400 });
      }
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "secret=" + encodeURIComponent(recaptchaSecret) + "&response=" + encodeURIComponent(recaptchaToken)
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return NextResponse.json({ error: "reCAPTCHA failed." }, { status: 400 });
      }
    }

    const from = String(process.env.RESEND_FROM_EMAIL || "");
    const to = String(process.env.RESEND_TO_EMAIL || "");
    if (!from || !to) {
      return NextResponse.json({ error: "Email not configured." }, { status: 500 });
    }

    const subject = "New website lead from " + name;
    const textLines = [
      "Name: " + name,
      "Email: " + email,
      "Phone: " + (phone || "—"),
      "",
      "Message:",
      String(message)
    ];

    await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email,
      text: textLines.join("\n")
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
