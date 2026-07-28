import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Stat } from '@/components/ui/Stat';
import { Icon } from '@/lib/icons';

export const Hero = ({ profile }) => {
  return (
    <header
      id="top"
      className="bg-hero relative flex min-h-[calc(100svh-68px)] scroll-mt-[84px] items-center overflow-hidden px-[clamp(20px,5vw,48px)] py-[clamp(56px,9vw,112px)]"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(120deg,rgba(10,9,8,.94)_0%,rgba(28,18,10,.74)_44%,rgba(150,62,10,.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_92%_at_18%_108%,rgba(242,92,5,.38),transparent_56%)]" />

      <Reveal className="relative z-[2] mx-auto w-full max-w-[1120px]">
        <Badge variant="status" className="mb-7">
          <span className="bg-mint h-2 w-2 rounded-full shadow-[0_0_0_3px_rgba(62,207,142,.28)]" />
          Open to embedded &amp; full-stack roles · {profile.location}
        </Badge>
        <h1 className="font-heading max-w-[15ch] text-[clamp(44px,9vw,100px)] leading-none font-bold tracking-[-0.035em] text-white [text-shadow:0_2px_44px_rgba(0,0,0,.4)]">
          {profile.name}
        </h1>
        <div className="mt-7 mb-6 flex flex-wrap gap-2.5">
          {profile.roles.map((role) => (
            <Badge key={role.label}>
              <Icon name={role.icon} className="text-sm text-[#ffc59b]" />
              {role.label}
            </Badge>
          ))}
        </div>
        <p className="mb-9 max-w-[60ch] text-[clamp(17px,2vw,22px)] leading-[1.55] text-white/85">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-3.5">
          <Button href="/contact">
            <Icon name="fa-solid fa-paper-plane" /> Get in touch
          </Button>
          <Button variant="glass" href={profile.cvHref}>
            <Icon name="fa-solid fa-download" /> Download CV
          </Button>
        </div>

        <div className="mt-[clamp(44px,6vw,72px)] flex flex-wrap gap-[clamp(24px,5vw,64px)]">
          {profile.stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </Reveal>
    </header>
  );
};
