import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body || {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const from = process.env.RESEND_FROM_EMAIL!;
    const to = process.env.RESEND_TO_EMAIL!;
    const subject = 'New website lead from ' + name;
    const textLines = [
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (phone || '—'),
      '',
      'Message:',
      String(message)
    ];

    await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email,
      text: textLines.join('\n')
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
