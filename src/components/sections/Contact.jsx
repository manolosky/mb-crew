import Image from 'next/image';

import { ContactMethod } from '@/components/cards/ContactMethod';
import { Section } from '@/components/layout/Section';
import { BackgroundVideo } from '@/components/ui/BackgroundVideo';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/lib/icons';

export const Contact = ({ profile }) => {
  return (
    <Section id="contact">
      <Reveal
        direction="fade"
        className="bg-hero relative overflow-hidden rounded-[26px] p-[clamp(32px,6vw,72px)] text-white"
      >
        <Image
          src="/images/contact-poster.webp"
          alt=""
          fill
          unoptimized
          sizes="(max-width: 1120px) 100vw, 1024px"
          aria-hidden="true"
          className="z-0 object-cover"
        />
        <BackgroundVideo src="/videos/contact.mp4" poster="/images/contact-poster.webp" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(18,15,12,.92),rgba(58,32,12,.8)_45%,rgba(190,75,10,.62))]" />
        <div className="pointer-events-none absolute -top-20 -right-10 z-[1] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(255,170,90,.25),transparent_68%)]" />
        <div className="relative z-[2] max-w-[620px]">
          <SectionHeading
            kicker="05 — Contact"
            title="Let's build something."
            description="Full-stack, an LLM in the loop or embedded — happy to talk. Reach me directly:"
            tone="dark"
            className="mb-8"
          />

          <div className="mb-[30px] flex flex-wrap gap-3.5">
            <ContactMethod
              label="Email"
              value={profile.email}
              href={`mailto:${profile.email}`}
              icon="fa-solid fa-envelope"
            />
            <ContactMethod
              label="Phone"
              value={profile.phone}
              href={`tel:${profile.phone}`}
              icon="fa-solid fa-phone"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile.socials.map((social) => (
              <Button
                key={social.label}
                variant="white"
                size="sm"
                href={social.href}
                className="max-w-full [overflow-wrap:anywhere]"
              >
                <Icon name={social.icon} className="text-[15px]" />
                {social.label} <span className="font-mono text-xs">{social.handle}</span>
              </Button>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
};
