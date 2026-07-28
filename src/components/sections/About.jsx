import { HobbyCard } from '@/components/cards/HobbyCard';
import { GradientBlob } from '@/components/ui/GradientBlob';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const About = ({ profile, hobbies }) => {
  return (
    <section id="about" className="relative scroll-mt-[84px] overflow-hidden">
      <GradientBlob
        variant="ember"
        className="-top-[60px] -right-20 h-[min(560px,70vw)] w-[min(560px,70vw)]"
      />
      <GradientBlob
        variant="amber"
        className="-bottom-[120px] -left-[100px] h-[min(480px,60vw)] w-[min(480px,60vw)]"
      />
      <div className="relative z-[1] mx-auto w-full max-w-[1120px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]">
        <Reveal>
          <SectionHeading kicker="01 — About" title="A hybrid engineer, on purpose." />
        </Reveal>

        <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-[clamp(20px,3vw,36px)]">
          <Reveal>
            <p className="text-body mb-5 text-[clamp(16px,1.8vw,18px)] leading-[1.62]">
              {profile.summary}
            </p>
            <p className="text-body text-[clamp(16px,1.8vw,18px)] leading-[1.62]">
              {profile.hybrid}
            </p>
          </Reveal>
          <Reveal>
            {/* Placeholder until the real photo arrives */}
            <div className="border-line flex aspect-4/5 items-center justify-center rounded-[20px] border bg-[repeating-linear-gradient(135deg,#edebe5_0_12px,#e4e2db_12px_24px)]">
              <span className="text-dim rounded-lg bg-white/70 px-4 py-2.5 font-mono text-[13px]">
                your photo
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-[clamp(36px,5vw,56px)]">
          <h3 className="font-heading mb-1 text-xl font-semibold">Beyond the keyboard</h3>
          <p className="text-muted mb-5 max-w-[52ch] text-[15px] leading-[1.55]">
            The habits and side quests that keep the engineering sharp.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] gap-4">
            {hobbies.map((hobby) => (
              <HobbyCard key={hobby.title} hobby={hobby} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
