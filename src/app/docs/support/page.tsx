import { DocLayout } from "@/components/docs/DocLayout";

export const metadata = { title: "Support — Usenly" };

export default function SupportPage() {
  return (
    <DocLayout title="Contact & Support" updated="June 20, 2026">

      {/* ── OVERVIEW ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          How to reach us
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly support is handled by a small team. We aim to respond to every
          request, but please read through the{" "}
          <a href="/docs/nft" className="text-neutral-900 underline">
            Documentation
          </a>{" "}
          and the FAQ below before opening a ticket — many common questions are
          already answered there.
        </p>
      </section>

      {/* ── CONTACT CHANNELS ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Contact channels
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Email —</strong>{" "}
            <a
              href="mailto:support@usenly.app"
              className="text-neutral-900 underline"
            >
              support@usenly.app
            </a>
            . Best for account issues, data requests, billing, and anything
            requiring written documentation.
          </li>
          <li>
            <strong>Telegram bot —</strong> Message{" "}
            <strong>@usenlybot</strong> and send <code>/support</code> to open a
            ticket directly through Telegram. Responses are routed to the same
            team as email.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          When contacting support, please include your registered email address
          and a clear description of the issue. Screenshots or error messages are
          always helpful.
        </p>
      </section>

      {/* ── RESPONSE TIMES ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Response time expectations
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Standard requests</strong> (general questions, feedback,
            profile issues) — response within 48 hours on business days.
          </li>
          <li>
            <strong>Verification and minting issues</strong> (bot not responding,
            penguin not generating, handle already claimed errors) — priority
            queue, response within 24 hours.
          </li>
          <li>
            <strong>Account security issues</strong> (suspected compromise,
            unauthorised access) — flag your email subject with [URGENT SECURITY].
            We aim to respond within 4 hours and can lock your account
            immediately on request.
          </li>
          <li>
            <strong>Data subject requests</strong> (access, correction, deletion
            under GDPR or similar law) — handled within 30 calendar days as
            required by law.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Response times are measured from when your message is received, not
          from when the issue is resolved. Complex issues may require follow-up
          exchanges before they are closed.
        </p>
      </section>

      {/* ── CONTACT FORM ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Send a message
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Fill in the form below and we will reply to your email address. All
          fields are required.
        </p>
        <form
          action="mailto:support@usenly.app"
          method="get"
          className="mt-5 space-y-4"
          aria-label="Contact form"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="contact-email"
              className="text-xs font-medium text-neutral-500 uppercase tracking-wide"
            >
              Your email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="contact-subject"
              className="text-xs font-medium text-neutral-500 uppercase tracking-wide"
            >
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              placeholder="Briefly describe your issue"
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="contact-category"
              className="text-xs font-medium text-neutral-500 uppercase tracking-wide"
            >
              Category
            </label>
            <select
              id="contact-category"
              name="category"
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none"
            >
              <option value="">Select a category</option>
              <option value="verification">Telegram verification issue</option>
              <option value="minting">Penguin generation issue</option>
              <option value="account">Account access / login</option>
              <option value="security">Account security concern</option>
              <option value="data">Data or privacy request</option>
              <option value="feedback">Feedback or suggestion</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="contact-message"
              className="text-xs font-medium text-neutral-500 uppercase tracking-wide"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="body"
              rows={5}
              placeholder="Please include your registered email and any relevant details or error messages..."
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
          >
            Send message
          </button>
        </form>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          Alternatively, email us directly at{" "}
          <a
            href="mailto:support@usenly.app"
            className="text-neutral-600 underline"
          >
            support@usenly.app
          </a>
          .
        </p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Support FAQ
        </h2>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          I haven't received a reply within the stated time — what should I do?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Check your spam folder for a reply from support@usenly.app. If nothing
          is there, send a follow-up with the word "Follow-up" in the subject
          line referencing your original ticket.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Can I contact support via Telegram DM?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Only through <strong>@usenlybot</strong>. We do not have a public
          Telegram support account that you should DM. If someone contacts you
          via Telegram claiming to be Usenly support, treat it as a phishing
          attempt and report it.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Do you offer live chat?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Not currently. All support is handled asynchronously via email and
          @usenlybot. We may introduce live chat in a future update.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          My penguin generation failed and now I can't retry — help?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Email support@usenly.app with your account email and your Telegram
          @username. We can manually trigger a re-generation from the backend
          within 24 hours.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          How do I request deletion of my data?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Send a deletion request to support@usenly.app from the email address
          registered on your account. We will confirm your identity, process the
          deletion, and send confirmation within 30 days. See the{" "}
          <a href="/docs/privacy" className="text-neutral-900 underline">
            Privacy Policy
          </a>{" "}
          for what data we hold.
        </p>
      </section>

    </DocLayout>
  );
}
