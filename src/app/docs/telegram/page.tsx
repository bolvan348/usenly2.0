import { DocLayout } from "@/components/docs/DocLayout";

export const metadata = { title: "Telegram Integration — Usenly" };

export default function TelegramDocPage() {
  return (
    <DocLayout title="Telegram Integration" updated="June 20, 2026">

      <p className="mt-3 text-sm leading-relaxed">
        Usenly uses Telegram's Bot API to verify that you own the @username
        your penguin is seeded from. This page explains exactly how the
        integration works, what data is accessed, and how to manage or revoke
        the connection.
      </p>

      {/* ── HOW @usenlybot WORKS ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          How @usenlybot works
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          @usenlybot is the official Usenly verification bot on Telegram. Its
          sole function is to deliver one-time verification codes to your
          Telegram account so that Usenly can confirm you control the account
          associated with your @username. The bot does not read your messages,
          access your contacts, or monitor any Telegram activity beyond the
          specific interaction you initiate.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          The bot only sends messages to you — it never sends unsolicited
          messages, promotional content, or notifications unless you trigger a
          new verification flow from your Usenly dashboard.
        </p>
      </section>

      {/* ── STEP-BY-STEP VERIFICATION ───────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Step-by-step verification
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Step 1.</strong> Log in to your Usenly account and go to
            your dashboard. Click "Connect Telegram."
          </li>
          <li>
            <strong>Step 2.</strong> You will be redirected to a Telegram
            deep-link (or presented with a QR code for mobile). This opens
            Telegram and navigates to @usenlybot automatically.
          </li>
          <li>
            <strong>Step 3.</strong> In the @usenlybot chat, tap or click
            "Start" (or send <code>/start</code>). The bot will reply with a
            6-digit one-time verification code.
          </li>
          <li>
            <strong>Step 4.</strong> Return to the Usenly dashboard. Enter the
            6-digit code in the verification field and click "Confirm."
          </li>
          <li>
            <strong>Step 5.</strong> Usenly checks that the code was issued to
            the same Telegram user who submitted it. If the match succeeds,
            your Telegram user ID and @username are linked to your account and
            you may proceed to generate your penguin.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Codes expire after <strong>10 minutes</strong>. If your code expires
          before you submit it, return to the dashboard and click "Resend" to
          get a fresh code. Old codes are invalidated immediately when a new one
          is issued.
        </p>
      </section>

      {/* ── SECURITY MODEL ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Security model
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          The verification design relies on the fact that only someone who can
          receive messages from @usenlybot — i.e., someone logged into the
          Telegram account — can retrieve the code. This is equivalent in
          principle to SMS OTP verification, but uses Telegram as the delivery
          channel.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Codes are cryptographically random (CSPRNG-generated), 6 digits
            long, and single-use. Each new request invalidates all previously
            issued codes for that account.
          </li>
          <li>
            We never ask for your Telegram password, SMS one-time code, or
            two-factor authentication code. The bot does not have access to your
            messages, groups, or contacts.
          </li>
          <li>
            The connection uses Telegram's official Bot API. Usenly is not
            granted an OAuth token scoped to your account — we receive only what
            Telegram's Bot API exposes: your user ID, first name, and @username
            (if set to public).
          </li>
          <li>
            Your Telegram user ID is stored encrypted at rest using AES-256.
            Your @username is stored in plaintext because it is used publicly
            (as the generation seed and optionally on your public profile).
          </li>
          <li>
            Phishing warning: Usenly staff will never DM you on Telegram asking
            for a verification code or password. If you receive such a message,
            do not respond and report the account to Telegram.
          </li>
        </ul>
      </section>

      {/* ── WHAT DATA THE BOT ACCESSES ──────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          What data the bot accesses
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          When you interact with @usenlybot, Telegram's Bot API provides the
          following fields with each incoming message:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Telegram user ID</strong> — a numeric identifier unique to
            your Telegram account. This is what we use to associate the code
            delivery with the code submission.
          </li>
          <li>
            <strong>Telegram @username</strong> — your public handle, if you
            have one set. This is the value seeded into the penguin generator.
          </li>
          <li>
            <strong>First name</strong> — provided by Telegram's API. We do not
            store or use this field beyond logging the verification event.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          We do not access, store, or process your Telegram message history,
          group memberships, phone number, contacts list, or any other Telegram
          account data.
        </p>
      </section>

      {/* ── UNLINKING TELEGRAM ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Unlinking Telegram from your account
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          You can unlink your Telegram account from Usenly at any time. This
          will remove your stored Telegram user ID and @username from our
          systems, but your penguin collectible will remain in your collection.
          You will not be able to re-verify a different Telegram handle without
          going through the full verification flow again.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          To unlink:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Go to your dashboard and navigate to Account Settings › Connected
            accounts.
          </li>
          <li>Click "Disconnect Telegram" and confirm.</li>
          <li>
            Your Telegram data will be deleted from our database within 24
            hours. If you need immediate deletion, email support@usenly.app.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          You can also block @usenlybot in Telegram at any time. This prevents
          the bot from messaging you and effectively stops future verifications
          (since we cannot deliver codes to a blocked bot), but does not
          automatically unlink your account in Usenly's database. Use the
          in-dashboard option above to ensure data is removed.
        </p>
      </section>

      {/* ── TROUBLESHOOTING ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Troubleshooting
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>@usenlybot is not sending me a code.</strong> First, check
            that you have not blocked the bot. Open Telegram, search for
            @usenlybot, and check if there is a "Blocked" indicator. If blocked,
            unblock the bot and then restart the verification from your
            dashboard.
          </li>
          <li>
            <strong>I entered the code but it says "Invalid or expired."</strong>{" "}
            Codes expire after 10 minutes and are single-use. Click "Resend" on
            the dashboard to generate a fresh code, then submit it within 10
            minutes.
          </li>
          <li>
            <strong>
              My @username changed since verification — is my account broken?
            </strong>{" "}
            Your existing penguin is safe. The penguin was generated from your
            handle at the time of verification. To claim a penguin for your new
            handle, you would need to unlink and re-verify. Contact support if
            you need help with this transition.
          </li>
          <li>
            <strong>
              I don't have a Telegram @username — can I still verify?
            </strong>{" "}
            No. The @username is the seed for your penguin, so it is required.
            Set a @username in your Telegram profile settings, then return to
            the Usenly verification flow.
          </li>
          <li>
            <strong>
              The deep-link doesn't open Telegram on my device.
            </strong>{" "}
            Make sure the Telegram app is installed and set as the default
            handler for <code>tg://</code> links. Alternatively, manually open
            Telegram, search for @usenlybot, and start the conversation
            yourself. Return to the dashboard after receiving the code.
          </li>
          <li>
            <strong>
              I verified successfully but my penguin didn't generate.
            </strong>{" "}
            Refresh the dashboard and wait 30 seconds. If the penguin still does
            not appear, try clicking "Generate" again. If it fails a second time,
            contact{" "}
            <a
              href="mailto:support@usenly.app"
              className="text-neutral-900 underline"
            >
              support@usenly.app
            </a>{" "}
            with your account email.
          </li>
        </ul>
      </section>

    </DocLayout>
  );
}
