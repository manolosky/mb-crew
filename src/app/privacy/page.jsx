import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { getProfile } from '@/lib/portfolio';

export const metadata = {
  title: 'Privacy & cookies — Manuel Bolaños',
  description:
    'How manuelbolanos.dev handles analytics cookies, the emails you send me and your data protection rights.',
  alternates: { canonical: '/privacy' },
};

// Bump both whenever the site changes how it handles personal data.
const NOTICE_VERSION = '2026-10-01';
const LAST_UPDATED = '1 October 2026';

const COOKIES = [
  {
    name: '_ga, _ga_*',
    purpose: 'Google Analytics: tells visits and sessions apart',
    duration: 'Up to 2 years',
    when: 'Only after you accept',
  },
  {
    name: 'mb-analytics-consent (local storage)',
    purpose: 'Remembers your cookie choice',
    duration: '12 months',
    when: 'When you choose',
  },
  {
    name: 'mb-animations-paused (local storage)',
    purpose: 'Remembers whether you paused the animations',
    duration: 'Until you clear it',
    when: 'Only if you use the animation toggle',
  },
];

const PROCESSORS = [
  ['Vercel Inc.', 'hosting and delivery of the site (USA)'],
  ['Google Ireland Ltd. / Google LLC', 'analytics, only with your consent'],
];

const LegalSection = ({ id, title, children }) => {
  return (
    <section id={id} className="mt-12 scroll-mt-[84px]">
      <h2 className="font-heading text-ink mb-4 text-[clamp(22px,3vw,28px)] font-bold tracking-[-0.01em]">
        {title}
      </h2>
      <div className="text-body flex flex-col gap-4 text-[16px] leading-[1.7]">{children}</div>
    </section>
  );
};

const PrivacyPage = () => {
  const { email } = getProfile();
  const emailLink = (
    <a
      href={`mailto:${email}`}
      className="text-brand-start font-semibold underline underline-offset-2"
    >
      {email}
    </a>
  );

  return (
    <div className="relative flex-1 overflow-x-clip">
      <a
        href="#main"
        className="focus:bg-brand-end sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[760px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]"
      >
        <p className="text-brand mb-3 font-mono text-[13px] tracking-[0.12em] uppercase">Legal</p>
        <h1 className="font-heading text-ink text-[clamp(34px,6vw,56px)] font-bold tracking-[-0.03em]">
          Privacy &amp; cookies
        </h1>
        <p className="text-body-soft mt-4 text-[clamp(16px,1.8vw,18px)] leading-[1.6]">
          This is my personal portfolio. This notice explains what personal data the site handles,
          why, and the choices you have. In short: nothing tracks you unless you accept analytics
          cookies, and if you email me, your message is only used to reply to you.
        </p>

        <LegalSection id="controller" title="Who is responsible">
          <p>
            Manuel Bolaños, an individual based in Spain, is responsible for this site and for the
            personal data described here. You can reach me at {emailLink}.
          </p>
        </LegalSection>

        <LegalSection id="data" title="What I collect and why">
          <p>
            <strong className="text-ink">Analytics (only if you accept).</strong> Google Analytics
            4, loaded through Google Tag Manager, measures the pages you visit, your approximate
            location (city level), your device and browser, and how you reached the site. Legal
            basis: your consent (Art. 6(1)(a) GDPR and Art. 22.2 of the Spanish LSSI). Without your
            consent, neither Google Tag Manager nor Google Analytics is loaded.
          </p>
          <p>
            <strong className="text-ink">Emails you send me.</strong> If you write to me, I use your
            email address and your message only to reply and to follow up on any opportunity it
            starts. Legal basis: my legitimate interest in answering you (Art. 6(1)(f) GDPR) and
            steps you ask me to take before a possible agreement (Art. 6(1)(b) GDPR).
          </p>
          <p>
            <strong className="text-ink">Hosting.</strong> Vercel, the hosting provider, processes
            technical request data such as your IP address and browser to deliver the pages and keep
            the service secure. Legal basis: legitimate interest.
          </p>
        </LegalSection>

        <LegalSection id="cookies" title="Cookies and local storage">
          <div className="border-line overflow-x-auto rounded-[14px] border">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14.5px]">
              <caption className="sr-only">Cookies and local storage used by this site</caption>
              <thead className="bg-surface text-ink">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Purpose
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Duration
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((cookie) => (
                  <tr key={cookie.name} className="border-line border-t">
                    <th
                      scope="row"
                      className="text-ink px-4 py-3 font-mono text-[13px] font-medium"
                    >
                      {cookie.name}
                    </th>
                    <td className="px-4 py-3">{cookie.purpose}</td>
                    <td className="px-4 py-3">{cookie.duration}</td>
                    <td className="px-4 py-3">{cookie.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            You can change or withdraw your choice at any time with{' '}
            <CookieSettingsButton className="text-brand-start cursor-pointer font-semibold underline underline-offset-2" />{' '}
            (also at the bottom of every page). Withdrawing consent deletes the Google Analytics
            cookies.
          </p>
        </LegalSection>

        <LegalSection id="recipients" title="Who receives the data">
          <p>These providers process data on my behalf:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            {PROCESSORS.map(([name, role]) => (
              <li key={name}>
                <strong className="text-ink">{name}</strong> — {role}
              </li>
            ))}
          </ul>
          <p>
            Transfers to the United States rely on the EU–US Data Privacy Framework and/or the
            European Commission&apos;s Standard Contractual Clauses. I don&apos;t sell your data or
            use it for advertising.
          </p>
        </LegalSection>

        <LegalSection id="retention" title="How long I keep it">
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              Emails: while I handle your request, and at most two years after our last exchange
              unless we start working together.
            </li>
            <li>Analytics data: up to 14 months, per the Google Analytics retention setting.</li>
          </ul>
        </LegalSection>

        <LegalSection id="rights" title="Your rights">
          <p>
            You can ask me for access to your data, and to rectify, erase, restrict or port it, or
            object to its processing, by writing to {emailLink}. You can withdraw your consent at
            any time without affecting earlier processing. If you believe your data has been
            mishandled, you can file a complaint with the Spanish Data Protection Agency (AEPD) at{' '}
            <a
              href="https://www.aepd.es"
              className="text-brand-start font-semibold underline underline-offset-2"
            >
              www.aepd.es
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection id="changes" title="Changes to this notice">
          <p>
            I update this notice whenever the site changes how it handles personal data. Version{' '}
            {NOTICE_VERSION}, last updated {LAST_UPDATED}.
          </p>
        </LegalSection>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
