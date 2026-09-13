import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/** True once SMTP credentials are configured (mailbox user + password). */
export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;
function getTransport(): Transporter {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

/** Where enquiries are delivered (defaults to the SMTP mailbox itself). */
export function mailTo(): string {
  return process.env.MAIL_TO || process.env.SMTP_USER || "info@stonicexport.com";
}

export async function sendMail(opts: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<void> {
  if (!mailConfigured()) throw new Error("EMAIL_NOT_CONFIGURED");
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  await getTransport().sendMail({
    from: `"Stonic Export" <${from}>`,
    to: mailTo(),
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    replyTo: opts.replyTo,
  });
}
