import { DocLayout } from "@/components/docs/DocLayout";

export const metadata = { title: "Privacy Policy — Usenly" };

export default function PrivacyPage() {
  return (
    <DocLayout title="Privacy Policy" updated="June 20, 2026">

      <p className="mt-3 text-sm leading-relaxed">
        This Privacy Policy describes how Usenly ("we", "us", "our") collects,
        uses, and protects information about you when you use our platform at
        usenly.app and @usenlybot (the "Service"). We are committed to handling
        your data transparently and only to the extent necessary to operate the
        Service. If you have questions, contact us at{" "}
        <a href="mailto:support@usenly.app" className="text-neutral-900 underline">
          support@usenly.app
        </a>
        .
      </p>

      {/* ── 1. DATA WE COLLECT ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          1. Data we collect
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We collect the minimum data required to provide the Service. This
          includes:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Email address</strong> — collected at registration, used for
            authentication, account notifications, and support replies.
          </li>
          <li>
            <strong>Password hash</strong> — your password is hashed using a
            strong one-way algorithm (bcrypt) before storage. We never store
            plaintext passwords and cannot retrieve them.
          </li>
          <li>
            <strong>Telegram user ID</strong> — collected during the Telegram
            verification flow via @usenlybot. Stored encrypted. Used to confirm
            handle ownership and link your penguin to your account.
          </li>
          <li>
            <strong>Telegram @username</strong> — collected after successful
            verification. Used as the seed for penguin generation. Optionally
            displayed on your public profile if you choose to make it visible.
          </li>
          <li>
            <strong>Browser fingerprint</strong> — a hash derived from browser
            properties (user-agent, timezone, screen resolution, installed
            fonts) used exclusively for multi-account fraud detection. This hash
            is stored and compared across registrations; the raw fingerprint
            data is not retained.
          </li>
          <li>
            <strong>IP address</strong> — logged on each request for security
            monitoring, rate limiting, and abuse prevention. Stored in server
            logs for up to 90 days, then deleted.
          </li>
          <li>
            <strong>Session tokens</strong> — a JWT issued at login and stored
            in an HTTP-only cookie. Used to maintain your authenticated session.
            Expires after 30 days of inactivity.
          </li>
          <li>
            <strong>Collectible metadata</strong> — the traits, rarity tier,
            generation timestamp, and handle hash associated with your penguin.
            This forms part of your collection record.
          </li>
        </ul>
      </section>

      {/* ── 2. WHY WE COLLECT IT ────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          2. Why we collect it
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Authentication and account management</strong> — email and
            password hash enable you to log in and manage your account.
          </li>
          <li>
            <strong>Telegram handle verification</strong> — Telegram user ID and
            @username are required to confirm that you own the handle before
            generating your penguin.
          </li>
          <li>
            <strong>Penguin generation</strong> — the @username is the seed
            input to the deterministic generation algorithm.
          </li>
          <li>
            <strong>Fraud and abuse prevention</strong> — browser fingerprint and
            IP address are used to detect and prevent creation of multiple
            accounts by a single individual, which would undermine the fairness
            of the one-penguin-per-handle system.
          </li>
          <li>
            <strong>Security monitoring</strong> — IP logs and session data help
            us detect suspicious activity such as credential stuffing or
            brute-force attacks.
          </li>
          <li>
            <strong>Support</strong> — we may reference your account data when
            responding to support requests.
          </li>
        </ul>
      </section>

      {/* ── 3. HOW IT IS STORED AND PROTECTED ──────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          3. How data is stored and protected
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          All data is stored on servers located in the European Union. We apply
          the following security measures:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            All connections to the Service are encrypted in transit via HTTPS
            (TLS 1.2 or higher).
          </li>
          <li>
            Passwords are hashed using bcrypt with a minimum work factor of 12.
            Telegram user IDs are encrypted at rest using AES-256.
          </li>
          <li>
            Database access is restricted to application services only; no
            direct public access is permitted.
          </li>
          <li>
            Session JWTs are signed with a server-side secret and stored in
            HTTP-only, Secure, SameSite=Strict cookies, reducing exposure to
            XSS attacks.
          </li>
          <li>
            Access to production data is restricted to a minimal number of team
            members and requires authentication.
          </li>
          <li>
            We perform regular security reviews and apply updates to our
            dependencies promptly.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Despite these measures, no system is completely immune to attack. In
          the event of a data breach affecting your personal data, we will notify
          you by email within 72 hours of becoming aware, as required by
          applicable law.
        </p>
      </section>

      {/* ── 4. COOKIE USAGE ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          4. Cookie usage
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We use cookies and similar storage mechanisms to operate the Service.
          See our{" "}
          <a href="/docs/cookies" className="text-neutral-900 underline">
            Cookie Policy
          </a>{" "}
          for a full breakdown of the cookies we set, their purpose, and their
          duration. In summary:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Essential cookies</strong> — session JWT, CSRF token. These
            are required for the Service to function and cannot be declined.
          </li>
          <li>
            <strong>Functional cookies</strong> — UI preferences (e.g., theme).
            These improve your experience and persist across visits.
          </li>
          <li>
            <strong>Analytics</strong> — we do not currently use third-party
            analytics services or advertising cookies.
          </li>
        </ul>
      </section>

      {/* ── 5. THIRD-PARTY SHARING ──────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          5. Third-party sharing
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We do not sell, rent, or share your personal data with third parties
          for marketing purposes.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          We may share data with:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Infrastructure providers</strong> — our hosting, database,
            and CDN providers process data on our behalf under data processing
            agreements. They are required to handle your data in accordance with
            applicable privacy law.
          </li>
          <li>
            <strong>Telegram</strong> — during verification, we communicate with
            Telegram's Bot API. Telegram processes the message delivery on their
            infrastructure. Telegram's own privacy policy governs their handling
            of that data.
          </li>
          <li>
            <strong>Law enforcement</strong> — we may disclose data when required
            by a valid legal order, court order, or applicable law, or to protect
            the rights, property, or safety of Usenly, our users, or the public.
          </li>
        </ul>
      </section>

      {/* ── 6. DATA RETENTION ───────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          6. Data retention
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Account data (email, password hash, Telegram data) is retained for
            as long as your account is active. Upon deletion request, account
            data is purged within 30 days.
          </li>
          <li>
            IP address logs are retained for up to 90 days, then automatically
            deleted.
          </li>
          <li>
            Browser fingerprint hashes are retained for up to 12 months for
            fraud detection purposes, then deleted.
          </li>
          <li>
            Collectible metadata (trait list, rarity, generation timestamp) may
            be retained in anonymised form for statistical analysis even after
            account deletion, as it does not contain personally identifiable
            information.
          </li>
        </ul>
      </section>

      {/* ── 7. YOUR RIGHTS ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          7. Your rights
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Depending on your jurisdiction, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Right of access</strong> — you may request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <strong>Right to rectification</strong> — you may request correction
            of inaccurate data.
          </li>
          <li>
            <strong>Right to erasure</strong> — you may request deletion of your
            personal data. We will process this within 30 days.
          </li>
          <li>
            <strong>Right to portability</strong> — you may request your data in
            a machine-readable format.
          </li>
          <li>
            <strong>Right to restrict processing</strong> — in certain
            circumstances, you may request that we limit how we use your data.
          </li>
          <li>
            <strong>Right to object</strong> — you may object to processing
            based on legitimate interests.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          To exercise any of these rights, email us at{" "}
          <a
            href="mailto:support@usenly.app"
            className="text-neutral-900 underline"
          >
            support@usenly.app
          </a>{" "}
          from the address registered on your account. We will verify your
          identity before processing the request and respond within 30 days. You
          also have the right to lodge a complaint with your national data
          protection authority.
        </p>
      </section>

      {/* ── 8. CHILDREN ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          8. Children's privacy
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          The Service is not directed at children under the age of 13. We do not
          knowingly collect personal data from children under 13. If you believe
          we have inadvertently collected such data, please contact us and we
          will delete it promptly.
        </p>
      </section>

      {/* ── 9. CHANGES ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          9. Changes to this policy
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We may update this Privacy Policy from time to time. Material changes
          will be communicated by email or by a notice on the platform at least
          14 days before taking effect. The "Updated" date at the top of this
          page reflects the date of the most recent revision. Continued use of
          the Service after changes take effect constitutes acceptance.
        </p>
      </section>

    </DocLayout>
  );
}
