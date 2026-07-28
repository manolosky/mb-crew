import { ContactMethod } from '@/components/cards/ContactMethod';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/lib/icons';

export const Contact = ({ profile }) => {
  return (
    <Section id="contact">
      <Reveal
        direction="fade"
        className="bg-hero relative overflow-hidden rounded-[26px] p-[clamp(32px,6vw,72px)] text-white"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/contact-poster.jpg"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src="/videos/contact.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(18,15,12,.92),rgba(58,32,12,.8)_45%,rgba(190,75,10,.62))]" />
        <div className="pointer-events-none absolute -top-20 -right-10 z-[1] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(255,170,90,.25),transparent_68%)]" />
        <div className="relative z-[2] max-w-[620px]">
          <div className="mb-3.5 font-mono text-[13px] tracking-[0.12em] text-white/75 uppercase">
            05 — Contact
          </div>
          <h2 className="font-heading mb-4 text-[clamp(28px,5vw,52px)] leading-[1.05] font-bold tracking-[-0.02em]">
            Let&apos;s build something.
          </h2>
          <p className="mb-8 text-[clamp(16px,2vw,19px)] leading-[1.55] text-white/85">
            Full-stack, embedded or an LLM in the loop — happy to talk. Reach me directly:
          </p>

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
              <a
                key={social.label}
                href={social.href}
                className="inline-flex max-w-full items-center gap-[9px] rounded-[11px] bg-white px-[18px] py-[11px] text-[14.5px] font-semibold [overflow-wrap:anywhere] text-[#c2440a] transition hover:brightness-[0.96]"
              >
                <Icon name={social.icon} className="text-[15px]" />
                {social.label} <span className="font-mono text-xs opacity-60">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
};
