import fetch from 'node-fetch';

/**
 * Sends an email using Resend HTTP API if RESEND_API_KEY is set, otherwise logs a warning.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[sendEmail] RESEND_API_KEY not set. Email not sent.');
    return;
  }
  await resend({
    to,
    subject,
    html,
  });
}

/**
 * Sends an email using the Resend HTTP API directly.
 */
export async function resend({ to, subject, html, from }: { to: string; subject: string; html: string; from?: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  const sender = from || process.env.RESEND_FROM || 'noreply@example.com';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender,
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[resend] Failed to send email: ${res.status} ${text}`);
  }
}

/**
 * Sends a welcome email to a new user.
 */
export async function sendWelcomeEmail(to: string): Promise<void> {
  const subject = 'Welcome!';
  const html = '<h1>Welcome to our service!</h1><p>We are glad to have you.</p>';
  await sendEmail(to, subject, html);
}

export default { sendEmail, resend, sendWelcomeEmail };
