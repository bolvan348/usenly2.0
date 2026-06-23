import { DocLayout } from "@/components/docs/DocLayout";

export const metadata = { title: "Terms of Service — Usenly" };

export default function TermsPage() {
  return (
    <DocLayout title="Terms of Service" updated="June 20, 2026">

      <p className="mt-3 text-sm leading-relaxed">
        These Terms of Service ("Terms") govern your access to and use of the
        Usenly platform, including the website at usenly.app, the @usenlybot
        Telegram bot, and any related services (collectively, the "Service").
        By creating an account or using the Service, you agree to be bound by
        these Terms. If you do not agree, do not use the Service.
      </p>

      {/* ── 1. SERVICE DESCRIPTION ──────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          1. Service description
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly is a digital collectibles platform that generates unique pixel
          penguin characters tied to verified Telegram usernames. Upon
          completing registration and verifying ownership of a Telegram
          @username through @usenlybot, users may claim a penguin collectible
          deterministically generated from their verified handle. The Service is
          provided subject to these Terms and our{" "}
          <a href="/docs/privacy" className="text-neutral-900 underline">
            Privacy Policy
          </a>
          , which is incorporated herein by reference.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly is an independent service and is not affiliated with, endorsed
          by, or sponsored by Telegram Messenger Inc. or its parent company.
        </p>
      </section>

      {/* ── 2. ELIGIBILITY ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          2. Eligibility
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          You must be at least 13 years of age to use the Service. If you are
          under the age of majority in your jurisdiction, you must have the
          consent of a parent or legal guardian. By using the Service, you
          represent and warrant that you meet these eligibility requirements.
          Usenly reserves the right to terminate any account found to be held
          by an ineligible user.
        </p>
      </section>

      {/* ── 3. ACCOUNT RULES ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          3. Account rules
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Each person may hold one Usenly account. Creating multiple accounts to
          circumvent limits, claim multiple penguins fraudulently, or otherwise
          abuse the Service is strictly prohibited and may result in termination
          of all associated accounts.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            You must provide accurate, complete, and current registration
            information, including a valid email address.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials. You must notify us immediately at
            support@usenly.app if you suspect unauthorised access.
          </li>
          <li>
            You may not use automated scripts, bots, or tools to create
            accounts, verify usernames, or interact with the Service except
            through officially supported integrations.
          </li>
          <li>
            You may not share your account with any other person or allow any
            other person to access your account.
          </li>
        </ul>
      </section>

      {/* ── 4. USER OBLIGATIONS ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          4. User obligations
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          By using the Service, you agree to:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Only verify Telegram @usernames that you genuinely own and control.
            Claiming a handle you do not own, have stolen, or have borrowed
            without permission constitutes fraud and will result in immediate
            account termination.
          </li>
          <li>
            Comply with all applicable laws and regulations in your jurisdiction,
            including but not limited to laws governing digital assets, online
            services, and consumer protection.
          </li>
          <li>
            Not use the Service in any manner that disrupts, damages, or impairs
            the functioning of the platform or the experience of other users.
          </li>
          <li>
            Not attempt to reverse-engineer, decompile, or extract the source
            code or algorithms underlying the penguin generation system.
          </li>
          <li>
            Not upload, post, or transmit any content that is unlawful, harmful,
            abusive, defamatory, or otherwise objectionable.
          </li>
        </ul>
      </section>

      {/* ── 5. COLLECTIBLE OWNERSHIP AND RIGHTS ─────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          5. Collectible ownership and intellectual property
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Upon successfully claiming your penguin collectible, Usenly grants you
          a personal, non-exclusive, non-transferable (except as described
          below), royalty-free licence to use the collectible image for personal,
          non-commercial purposes, including as a social media avatar or profile
          image.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          All intellectual property rights in the penguin sprites, generation
          algorithms, trait systems, and underlying artwork remain the exclusive
          property of Usenly. Granting of a collectible does not transfer
          copyright or any other intellectual property right to you.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          You may not reproduce, distribute, sell, or create derivative works
          from your penguin for commercial purposes without express written
          permission from Usenly. Transfers of collectibles between Usenly
          accounts are not currently supported and will be governed by separate
          marketplace terms when that feature is launched.
        </p>
      </section>

      {/* ── 6. PAYMENT TERMS ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          6. Payment terms
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Claiming your first penguin collectible is currently free of charge.
          Usenly reserves the right to introduce paid features, premium
          collectibles, limited drops, or subscription tiers in the future. Any
          such features will be clearly priced and described before purchase.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Where payments are accepted, all fees are quoted and charged in the
          currency displayed at checkout. Fees are non-refundable except where
          required by applicable law or as expressly stated in an offer. We do
          not store full payment card details — payments are processed by
          third-party processors compliant with PCI-DSS standards.
        </p>
      </section>

      {/* ── 7. PROHIBITED USES ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          7. Prohibited uses
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          The following uses of the Service are expressly prohibited:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Fraudulent verification — claiming ownership of a Telegram handle
            that you do not legitimately control.
          </li>
          <li>
            Automation abuse — using scripts, bots, or automation to create
            accounts, bypass rate limits, or probe the generation system.
          </li>
          <li>
            Market manipulation — creating artificial scarcity, inflating rarity
            perceptions, or spreading false information about the value of
            collectibles.
          </li>
          <li>
            Harassment — using the platform, public profiles, or support channels
            to harass, threaten, or harm other users or Usenly staff.
          </li>
          <li>
            Illegal activity — using the Service in furtherance of money
            laundering, fraud, or any other illegal purpose.
          </li>
          <li>
            Security testing without authorisation — attempting to probe, scan,
            or test the vulnerability of the platform without prior written
            consent. Responsible disclosure requests should be sent to
            support@usenly.app.
          </li>
        </ul>
      </section>

      {/* ── 8. PLATFORM RIGHTS ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          8. Platform rights
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly reserves the right at any time, with or without notice, to:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Modify, suspend, or discontinue any aspect of the Service, including
            removing features or changing pricing.
          </li>
          <li>
            Update these Terms. Material changes will be communicated by email
            or by a notice on the platform. Continued use of the Service after
            such changes constitutes acceptance.
          </li>
          <li>
            Investigate suspected violations of these Terms and take any
            appropriate action, including content removal, account suspension,
            or referral to law enforcement.
          </li>
          <li>
            Adjust the generation algorithm, trait tables, or rarity
            distributions for future penguins without affecting already-issued
            collectibles.
          </li>
        </ul>
      </section>

      {/* ── 9. TERMINATION ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          9. Termination
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          You may terminate your account at any time by emailing
          support@usenly.app and requesting deletion. We will process deletion
          requests within 30 days and confirm by email.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly may suspend or terminate your account immediately, without prior
          notice, if you violate these Terms, engage in fraudulent activity, or
          if we are required to do so by law. Upon termination, your right to
          access the Service ceases immediately. Provisions of these Terms that
          by their nature should survive termination (including intellectual
          property rights, disclaimers, and limitations of liability) will
          continue to apply.
        </p>
      </section>

      {/* ── 10. DISCLAIMERS AND LIABILITY ───────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          10. Disclaimers and limitation of liability
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          The Service is provided "as is" and "as available" without any
          warranty of any kind, express or implied, including but not limited to
          warranties of merchantability, fitness for a particular purpose, or
          non-infringement. Usenly does not guarantee that the Service will be
          uninterrupted, error-free, or secure.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly does not guarantee the resale value, market value, or liquidity
          of any collectible on third-party platforms or marketplaces. Digital
          collectibles carry risk and their value may fluctuate or become zero.
          You participate at your own risk.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          To the maximum extent permitted by applicable law, Usenly's total
          liability to you for any claim arising out of or relating to the
          Service will not exceed the greater of (a) the total fees you paid to
          Usenly in the 12 months preceding the claim, or (b) €50 (fifty euros).
          In no event will Usenly be liable for any indirect, incidental,
          special, consequential, or punitive damages, including loss of profits,
          data, or goodwill.
        </p>
      </section>

      {/* ── 11. GOVERNING LAW ───────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          11. Governing law and dispute resolution
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          These Terms are governed by and construed in accordance with applicable
          law. Any dispute arising out of or in connection with these Terms that
          cannot be resolved amicably through good-faith negotiation will be
          submitted to the jurisdiction of the competent courts.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Before initiating any formal proceedings, you agree to contact Usenly
          at support@usenly.app and attempt to resolve the dispute informally
          for a period of at least 30 days.
        </p>
      </section>

      {/* ── 12. CONTACT ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          12. Contact
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Questions about these Terms should be directed to{" "}
          <a
            href="mailto:support@usenly.app"
            className="text-neutral-900 underline"
          >
            support@usenly.app
          </a>
          . We will endeavour to respond within 10 business days.
        </p>
      </section>

    </DocLayout>
  );
}
