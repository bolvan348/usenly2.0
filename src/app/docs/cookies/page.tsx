import { DocLayout } from "@/components/docs/DocLayout";

export const metadata = { title: "Cookie Policy — Usenly" };

export default function CookiesPage() {
  return (
    <DocLayout title="Cookie Policy" updated="June 20, 2026">

      <p className="mt-3 text-sm leading-relaxed">
        This Cookie Policy explains what cookies are, which ones Usenly uses,
        why we use them, and how you can manage them. For more detail on how we
        handle personal data more broadly, see our{" "}
        <a href="/docs/privacy" className="text-neutral-900 underline">
          Privacy Policy
        </a>
        .
      </p>

      {/* ── WHAT ARE COOKIES ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          What are cookies?
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Cookies are small text files that a website places in your browser
          when you visit. They are widely used to make websites work correctly
          or more efficiently, to remember your preferences, and to provide
          information to the site operator about how the site is being used.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          In addition to traditional cookies, we use similar browser storage
          mechanisms (such as <code>localStorage</code>) for some functional
          preferences. These are governed by the same principles set out here.
        </p>
      </section>

      {/* ── ESSENTIAL COOKIES ───────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Essential cookies
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Essential cookies are necessary for the Service to function. Without
          them, features like logging in, staying logged in, and CSRF protection
          would not work. These cookies cannot be disabled through your Usenly
          settings — if you block them via your browser, parts of the Service
          will not work correctly.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Session authentication (JWT)</strong> — maintains your
            logged-in state between page visits. Stored as an HTTP-only, Secure,
            SameSite=Strict cookie so it is not accessible to JavaScript.
          </li>
          <li>
            <strong>CSRF token</strong> — a cross-site request forgery protection
            token included with sensitive form submissions to prevent malicious
            third-party sites from triggering actions on your behalf.
          </li>
        </ul>
      </section>

      {/* ── FUNCTIONAL COOKIES ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Functional cookies
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Functional cookies improve your experience on the platform by
          remembering choices you have made. They are not strictly required for
          the Service to operate, but disabling them may affect how the platform
          behaves for you on future visits.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>UI preferences</strong> — stores minor interface preferences
            such as dismissed banners or notification states.
          </li>
          <li>
            <strong>Verification flow state</strong> — temporarily stores
            where you are in the multi-step registration and verification flow
            so that a page refresh does not restart the process from the
            beginning.
          </li>
        </ul>
      </section>

      {/* ── ANALYTICS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Analytics and tracking
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly does not currently use any third-party analytics services
          (such as Google Analytics, Mixpanel, or similar tools). We do not
          serve advertising cookies or tracking pixels. We do not participate
          in behavioural advertising networks.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          We may collect basic, aggregated, server-side metrics (such as total
          page requests and error rates) to monitor platform health. These are
          not user-linked and do not involve client-side cookies.
        </p>
      </section>

      {/* ── COOKIE TABLE ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Cookie reference table
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          The table below lists the specific cookies set by usenly.app.
        </p>
        <div className="mt-4 overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium text-neutral-700 border-b border-neutral-200">
                  Name
                </th>
                <th className="px-4 py-2 font-medium text-neutral-700 border-b border-neutral-200">
                  Type
                </th>
                <th className="px-4 py-2 font-medium text-neutral-700 border-b border-neutral-200">
                  Purpose
                </th>
                <th className="px-4 py-2 font-medium text-neutral-700 border-b border-neutral-200">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-600">
              <tr className="border-b border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">usenly_session</td>
                <td className="px-4 py-2">Essential</td>
                <td className="px-4 py-2">
                  JWT session token — keeps you logged in across page visits.
                  HTTP-only, Secure, SameSite=Strict.
                </td>
                <td className="px-4 py-2">30 days (rolling)</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">csrf_token</td>
                <td className="px-4 py-2">Essential</td>
                <td className="px-4 py-2">
                  CSRF protection token included with form submissions.
                </td>
                <td className="px-4 py-2">Session</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">ui_prefs</td>
                <td className="px-4 py-2">Functional</td>
                <td className="px-4 py-2">
                  Stores minor UI state (e.g., dismissed prompts).
                </td>
                <td className="px-4 py-2">1 year</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">flow_state</td>
                <td className="px-4 py-2">Functional</td>
                <td className="px-4 py-2">
                  Temporarily persists your position in the registration /
                  verification flow.
                </td>
                <td className="px-4 py-2">1 hour</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── MANAGING COOKIES ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          How to manage cookies
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Most browsers allow you to view, delete, and block cookies through
          their settings. Below are links to instructions for common browsers:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Chrome</strong> — Settings › Privacy and security › Cookies
            and other site data
          </li>
          <li>
            <strong>Firefox</strong> — Settings › Privacy &amp; Security ›
            Cookies and Site Data
          </li>
          <li>
            <strong>Safari</strong> — Preferences › Privacy › Manage Website
            Data
          </li>
          <li>
            <strong>Edge</strong> — Settings › Cookies and site permissions ›
            Cookies and site data
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Please be aware that blocking or deleting essential cookies will sign
          you out of the Service and may prevent certain features from working.
          Blocking functional cookies will cause the platform to forget your UI
          preferences between visits.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Because we do not use advertising or analytics cookies, opting out of
          third-party tracking via browser extensions (such as uBlock Origin or
          Privacy Badger) will not affect your experience on Usenly.
        </p>
      </section>

      {/* ── CHANGES ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Changes to this policy
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We may update this Cookie Policy if we introduce new features that
          require additional cookies. The "Updated" date at the top of this page
          will reflect any changes. Continued use of the Service after changes
          are posted constitutes acceptance. For questions, contact us at{" "}
          <a
            href="mailto:support@usenly.app"
            className="text-neutral-900 underline"
          >
            support@usenly.app
          </a>
          .
        </p>
      </section>

    </DocLayout>
  );
}
