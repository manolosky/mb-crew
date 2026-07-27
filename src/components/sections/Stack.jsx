import { SkillGroupCard } from '@/components/cards/SkillGroupCard';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Stack = ({ skills }) => {
  return (
    <Section id="stack" band>
      <Reveal>
        <SectionHeading
          kicker="02 — Tech stack"
          title="Tools I reach for."
          description="From production web apps to firmware on bare metal — organized by where they live in the stack."
        />
      </Reveal>
      <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
        {skills.map((group) => (
          <Reveal key={group.group}>
            <SkillGroupCard group={group} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
