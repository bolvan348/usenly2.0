import { DocLayout } from "@/components/docs/DocLayout";

export const metadata = { title: "Documentation — Usenly" };

export default function NftDocPage() {
  return (
    <DocLayout title="Platform Documentation" updated="June 20, 2026">

      {/* ── GETTING STARTED ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Getting started
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly is a pixel penguin collectibles platform where every Telegram
          username maps to exactly one unique penguin. The generation is
          deterministic — your handle is the seed, so your penguin is permanently
          yours and cannot be replicated by anyone else.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          New users follow three steps: create an account, verify ownership of
          your Telegram handle via <strong>@usenlybot</strong>, then claim your
          penguin from the dashboard. The whole process takes under two minutes.
        </p>
      </section>

      {/* ── STEP-BY-STEP GUIDE ──────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Step-by-step guide for new users
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Step 1 — Register.</strong> Go to{" "}
            <a href="/start" className="text-neutral-900 underline">
              usenly.app/start
            </a>{" "}
            and enter your email address and a password (minimum 8 characters).
            You will receive a confirmation email; click the link inside to
            activate your account.
          </li>
          <li>
            <strong>Step 2 — Open your dashboard.</strong> After email
            confirmation, log in and visit your dashboard. You will see a prompt
            to connect your Telegram account.
          </li>
          <li>
            <strong>Step 3 — Connect Telegram.</strong> Click "Connect Telegram"
            on the dashboard. This opens a Telegram deep-link that starts a
            conversation with <strong>@usenlybot</strong>. Send the{" "}
            <code>/start</code> command inside that chat.
          </li>
          <li>
            <strong>Step 4 — Verify your handle.</strong> The bot sends you a
            one-time verification code. Paste this code into the verification
            field on the Usenly dashboard and click Confirm. This proves you
            control the Telegram account with your @username.
          </li>
          <li>
            <strong>Step 5 — Claim your penguin.</strong> Once verification
            succeeds, click "Generate my penguin." The system uses your handle as
            a deterministic seed to produce your unique pixel penguin within a
            few seconds.
          </li>
          <li>
            <strong>Step 6 — View and share.</strong> Your penguin appears in
            your collection. You can view full metadata, download the image, and
            share your public profile page.
          </li>
        </ul>
      </section>

      {/* ── REGISTRATION ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Registration
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Registration requires a valid email address and a password. We do not
          collect your real name, phone number, or payment information at sign-up.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Email must be unique — one account per email address is enforced.
          </li>
          <li>
            Password must be at least 8 characters. We strongly recommend using
            a password manager and enabling a unique password for Usenly.
          </li>
          <li>
            A confirmation email is sent immediately. Check your spam folder if
            it does not arrive within 5 minutes.
          </li>
          <li>
            If the confirmation link expires (valid for 24 hours), you can
            request a new one from the login screen.
          </li>
        </ul>
      </section>

      {/* ── TELEGRAM VERIFICATION ───────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Telegram verification with @usenlybot
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Telegram verification is the core mechanism that ties your unique
          @username to your penguin. Because the penguin is seeded from the
          handle, only the true owner of the Telegram account can claim it.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          How it works:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            The Usenly dashboard generates a short-lived, single-use code and
            sends it to your Telegram account via <strong>@usenlybot</strong>.
          </li>
          <li>
            You paste the code back into the dashboard. The server checks that
            the Telegram user ID returning the code matches the one the code was
            issued to.
          </li>
          <li>
            Codes expire after 10 minutes. If yours expires, click "Resend" to
            generate a new one.
          </li>
          <li>
            We never ask for your Telegram password or SMS code. The entire flow
            uses Telegram's official Bot API and does not require granting
            Usenly access to your messages.
          </li>
          <li>
            Your Telegram user ID is stored encrypted in our database and is
            never shared publicly. Your @username is displayed on your public
            profile only with your consent.
          </li>
        </ul>
      </section>

      {/* ── RARITY TIERS ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Rarity tiers and drop rates
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Every penguin is assigned one of five rarity tiers. The tier is
          derived deterministically from a hash of your Telegram handle — it is
          not random at mint time and cannot be re-rolled. Once assigned, the
          rarity is permanent.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Common (60% of all penguins)</strong> — Wide, vibrant
            palette with high colour contrast. Lively and expressive pixel
            art. The most numerous tier on the platform.
          </li>
          <li>
            <strong>Rare (25% of all penguins)</strong> — Harmonious, curated
            colour combinations. Noticeably more cohesive visual styling with
            subtle detail work.
          </li>
          <li>
            <strong>Epic (10% of all penguins)</strong> — Restricted palette
            with deliberate minimal-colour compositions. Elevated visual
            weight and distinctiveness.
          </li>
          <li>
            <strong>Legendary (4% of all penguins)</strong> — Unified thematic
            style with premium decorative details: accessories, backgrounds, and
            embellishments not found in lower tiers.
          </li>
          <li>
            <strong>Mythic (1% of all penguins)</strong> — Metallic material
            rendering, near-monochrome palette, and unique visual signatures.
            The rarest and most visually distinctive penguins on Usenly.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Because the tier is deterministic, you can look up any handle's
          expected rarity before claiming. There is no way to manipulate or
          re-seed the outcome.
        </p>
      </section>

      {/* ── HOW GENERATION WORKS ────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          How penguin generation works
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Penguin generation is fully deterministic. The process works as
          follows:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Your verified Telegram @handle is normalised (lowercased, trimmed)
            and passed through a cryptographic hash function (SHA-256).
          </li>
          <li>
            The resulting hash is used as a seed for a pseudo-random number
            generator. Every trait — body colour, eye shape, beak style,
            accessories, background — is selected from weighted trait tables
            using this seeded generator.
          </li>
          <li>
            Rarity tier is determined first (from the top bytes of the hash),
            then trait tables appropriate to that tier are applied.
          </li>
          <li>
            The final pixel art is composed from layered sprite sheets and
            rendered to a 512×512 PNG. A vector SVG version is also stored.
          </li>
          <li>
            Metadata (trait list, rarity, generation timestamp, handle hash) is
            written to the database and linked to your account. The handle itself
            is never stored in plaintext in the metadata record.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed">
          Because the algorithm is deterministic, running generation twice on the
          same handle produces identical output. This means your penguin is
          uniquely and permanently yours — as long as your handle stays the same.
          If you change your Telegram @username, your existing penguin remains in
          your account but a re-generation would produce a different result.
        </p>
      </section>

      {/* ── OWNERSHIP ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Collectible ownership
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          When you claim your penguin, the collectible is permanently linked to
          your Usenly account. You own the visual asset and may download it for
          personal use — as an avatar, wallpaper, or profile picture — without
          restriction.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Transfers, trades, and marketplace listings are governed by separate
          terms that will be published when the Usenly marketplace launches.
          Until then, penguins are non-transferable between accounts.
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          Usenly retains the right to revoke a collectible if the account is
          found to have fraudulently claimed a handle that was not genuinely
          owned at verification time, or if the account violates the Terms of
          Service.
        </p>
      </section>

      {/* ── ACCOUNT SECURITY ────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Account security
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Your Usenly account protects your collectibles. We recommend the
          following security practices:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            Use a strong, unique password. Do not reuse passwords from other
            services.
          </li>
          <li>
            Never share your login credentials with anyone. Usenly staff will
            never ask for your password.
          </li>
          <li>
            If you suspect your account has been compromised, change your
            password immediately and email{" "}
            <a
              href="mailto:support@usenly.app"
              className="text-neutral-900 underline"
            >
              support@usenly.app
            </a>{" "}
            to have the account locked while you regain access.
          </li>
          <li>
            Keep the email address on your account current and accessible. It is
            used for password resets and security notifications.
          </li>
          <li>
            Session tokens expire after 30 days of inactivity. Always log out on
            shared devices.
          </li>
          <li>
            Phishing warning: Usenly will never contact you via Telegram DM
            asking for verification codes, passwords, or payment details.
            @usenlybot only sends codes when you initiate a verification flow
            from the dashboard.
          </li>
        </ul>
      </section>

      {/* ── TROUBLESHOOTING ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Common troubleshooting
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
          <li>
            <strong>Confirmation email not received.</strong> Check your spam or
            promotions folder. Add support@usenly.app to your contacts and
            request a new confirmation link from the login screen.
          </li>
          <li>
            <strong>@usenlybot is not responding.</strong> Make sure you have not
            blocked the bot. Search for @usenlybot in Telegram and start a fresh
            conversation with <code>/start</code>. If the bot is still
            unresponsive, contact support — the service may be under maintenance.
          </li>
          <li>
            <strong>Verification code expired.</strong> Codes are valid for 10
            minutes. Click "Resend" on the dashboard to get a fresh code.
          </li>
          <li>
            <strong>"Handle already claimed" error.</strong> Each Telegram handle
            can only be verified by one Usenly account. If you believe this is
            an error (e.g., you changed handles and the old account is
            abandoned), contact support with proof of Telegram ownership.
          </li>
          <li>
            <strong>Penguin generation stuck or failed.</strong> Refresh the
            dashboard and wait 30 seconds. If the penguin still does not appear,
            try triggering generation again. If the issue persists, open a
            support ticket with your account email and username.
          </li>
          <li>
            <strong>Cannot log in after password reset.</strong> Clear your
            browser cookies and try again in a private/incognito window. If the
            problem persists, email support@usenly.app.
          </li>
        </ul>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mt-8">
          Frequently asked questions
        </h2>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Can I have more than one penguin?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Each verified Telegram handle produces exactly one penguin. If you own
          multiple Telegram accounts with distinct @usernames, you may verify
          each one on the same Usenly account and collect multiple penguins.
          Creating multiple Usenly accounts to circumvent this rule is prohibited.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          What happens if I change my Telegram username?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Your existing penguin stays in your account — it was generated from
          your handle at verification time. If you want a penguin for your new
          handle, you would need to re-verify and generate a new one. The old
          penguin remains in your collection.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Is my penguin stored on a blockchain?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Currently penguins are stored on Usenly's infrastructure, not on a
          public blockchain. On-chain minting may be introduced in a future
          update. Ownership is tracked in our database and tied to your
          authenticated account.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Can I re-roll my rarity tier?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          No. Rarity is determined deterministically from your handle hash and
          cannot be changed or re-rolled. This design ensures fairness — no one
          can pay or retry their way to a higher tier.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Is generation free?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Claiming your first penguin is free. Future collectibles, limited
          drops, or premium traits may carry a fee. Any paid features will be
          clearly marked before purchase.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          What does Usenly do with my Telegram data?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          We store your Telegram user ID (encrypted) and your public @username
          (used to seed generation and optionally shown on your profile). We do
          not read your messages, contacts, or any other Telegram data. See the{" "}
          <a href="/docs/privacy" className="text-neutral-900 underline">
            Privacy Policy
          </a>{" "}
          for full details.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Can I delete my account and penguin?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Yes. You can request full account and data deletion by emailing
          support@usenly.app. Once deleted, your handle becomes available for
          re-verification by anyone, and if re-verified, the same penguin image
          would be regenerated (because generation is deterministic). The
          deletion of your account removes your claim on it.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Why can't I see a penguin preview before claiming?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          To prevent handle squatting — where someone claims a handle just to
          preview a Mythic tier penguin and then abandons it — the penguin is
          only rendered after verification is complete and the claim is confirmed.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          How long does support take to respond?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Standard requests are handled within 48 hours. Verification and minting
          issues are prioritised and typically resolved within 24 hours. See the{" "}
          <a href="/docs/support" className="text-neutral-900 underline">
            Support page
          </a>{" "}
          for all contact options.
        </p>

        <p className="mt-5 text-sm font-semibold text-neutral-800">
          Is Usenly affiliated with Telegram?
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          No. Usenly is an independent platform that uses Telegram's public Bot
          API for handle verification. We are not affiliated with, endorsed by,
          or partnered with Telegram Messenger or its parent company.
        </p>
      </section>

    </DocLayout>
  );
}
