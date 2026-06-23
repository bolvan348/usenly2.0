import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, code: string) {
  const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: `Your Usenly verification code: ${code}`,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  body { margin:0; padding:0; background:#F7F7F5; font-family:'Courier New',Courier,monospace; }
  .wrap { max-width:480px; margin:40px auto; background:#fff; border:2px solid #0A0A0A; }
  .titlebar { background:#0A0A0A; padding:10px 16px; }
  .titlebar span { color:rgba(255,255,255,0.5); font-size:11px; letter-spacing:0.15em; }
  .body { padding:32px 28px; }
  .label { color:rgba(10,10,10,0.4); font-size:11px; letter-spacing:0.18em; margin-bottom:6px; font-family:monospace; }
  .code-box { background:#0A0A0A; padding:24px; text-align:center; margin:20px 0; }
  .code { color:#CC0000; font-size:48px; letter-spacing:0.3em; font-weight:bold; font-family:monospace; }
  .info { color:rgba(10,10,10,0.5); font-size:12px; line-height:1.8; border-top:1px dashed rgba(10,10,10,0.15); padding-top:16px; margin-top:20px; font-family:sans-serif; }
  .footer { background:#F7F7F5; border-top:2px solid rgba(10,10,10,0.1); padding:10px 16px; font-size:10px; letter-spacing:0.12em; color:rgba(10,10,10,0.3); font-family:monospace; }
</style>
</head>
<body>
<div class="wrap">
  <div class="titlebar">
    <span>&#9632; USENLY — EMAIL VERIFICATION</span>
  </div>
  <div class="body">
    <p class="label">&gt; YOUR VERIFICATION CODE:</p>
    <div class="code-box">
      <div class="code">CODE_PLACEHOLDER</div>
    </div>
    <p style="font-size:14px;color:rgba(10,10,10,0.75);line-height:1.6;margin:0;font-family:sans-serif;">
      Enter this 6-digit code on the Usenly verification screen to confirm your email address.
      The code expires in <strong>10 minutes</strong>.
    </p>
    <div class="info">
      <p style="margin:0 0 6px;">&#9888; If you didn't request this, ignore this email — no action needed.</p>
      <p style="margin:0;">Do not share this code with anyone.</p>
    </div>
  </div>
  <div class="footer">&#169; USENLY &middot; DO NOT REPLY</div>
</div>
</body>
</html>`.replace("CODE_PLACEHOLDER", code),
  });

  if (result.error) {
    throw new Error(result.error.message ?? "Resend API error");
  }

  return result;
}
