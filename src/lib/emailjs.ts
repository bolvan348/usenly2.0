/**
 * Server-side EmailJS sender via REST API.
 * Template variables expected in the EmailJS template:
 *   {{to_email}}  — recipient address
 *   {{code}}      — 6-digit verification code
 */

const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

export async function sendVerificationEmail(to: string, code: string) {
  const payload = {
    service_id:    process.env.EMAILJS_SERVICE_ID,
    template_id:   process.env.EMAILJS_TEMPLATE_ID,
    user_id:       process.env.EMAILJS_PUBLIC_KEY,
    accessToken:   process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      to_email: to,
      code,
    },
  };

  const res = await fetch(EMAILJS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(`EmailJS error ${res.status}: ${text}`);
  }

  return res;
}
