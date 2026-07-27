import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { GradientBlob } from '@/components/ui/GradientBlob';
import { IconTile } from '@/components/ui/IconTile';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stat } from '@/components/ui/Stat';
import { Icon } from '@/lib/icons';
import { getHobbies, getProfile, getSkills } from '@/lib/portfolio';

// Temporary atoms showcase fed with real portfolio data.
// Replaced by the actual sections in phase 2.
const Home = () => {
  const profile = getProfile();
  const skills = getSkills();
  const hobbies = getHobbies();

  return (
    <main className="flex-1">
      {/* Dark band: hero atoms */}
      <section className="bg-hero px-[clamp(20px,5vw,48px)] py-[clamp(56px,9vw,112px)]">
        <div className="mx-auto w-full max-w-[1120px]">
          <Badge variant="status" className="mb-7">
            <span className="bg-mint h-2 w-2 rounded-full shadow-[0_0_0_3px_rgba(62,207,142,.28)]" />
            Open to embedded &amp; full-stack roles · {profile.location}
          </Badge>
          <h1 className="font-heading max-w-[15ch] text-[clamp(44px,9vw,100px)] leading-none font-bold tracking-[-0.035em] text-white">
            {profile.name}
          </h1>
          <div className="my-7 flex flex-wrap gap-2.5">
            {profile.roles.map((role) => (
              <Badge key={role.label}>
                <Icon name={role.icon} className="text-sm text-[#d9c4ff]" />
                {role.label}
              </Badge>
            ))}
          </div>
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
        </div>
      </section>

      {/* Light band: content atoms */}
      <section className="relative overflow-hidden px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]">
        <GradientBlob
          variant="violet"
          className="-top-16 -right-20 h-[min(560px,70vw)] w-[min(560px,70vw)]"
        />
        <GradientBlob
          variant="blue"
          className="-bottom-28 -left-24 h-[min(480px,60vw)] w-[min(480px,60vw)]"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1120px]">
          <SectionHeading
            kicker="00 — Atoms"
            title="Design system preview."
            description="Every reusable piece of the one-page, rendered with the real portfolio data."
          />
          <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
            {hobbies.slice(0, 2).map((hobby) => (
              <Card key={hobby.title} hover className="p-[22px]">
                <IconTile className="mb-3.5">
                  <Icon name={hobby.icon} />
                </IconTile>
                <div className="font-heading mb-1.5 text-[16.5px] font-semibold">{hobby.title}</div>
                <div className="text-faint text-[13.5px] leading-6">{hobby.note}</div>
              </Card>
            ))}
            <Card className="bg-surface border-line-soft p-[22px]">
              <div className="font-heading mb-3.5 flex items-center gap-[11px] text-base font-semibold">
                <IconTile size="sm">
                  <Icon name={skills[0].icon} />
                </IconTile>
                {skills[0].group}
              </div>
              <div className="flex flex-wrap gap-2">
                {skills[0].items.map((item) => (
                  <Chip key={item} interactive>
                    {item}
                  </Chip>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
