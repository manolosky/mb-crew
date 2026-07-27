import { ExperienceItem } from '@/components/cards/ExperienceItem';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Experience = ({ experience }) => {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHeading kicker="03 — Experience" title="Where I've built." />
      </Reveal>
      <div className="relative mt-10 flex flex-col">
        {experience.map((job) => (
          <ExperienceItem key={`${job.company}-${job.period}`} job={job} />
        ))}
      </div>
    </Section>
  );
};
