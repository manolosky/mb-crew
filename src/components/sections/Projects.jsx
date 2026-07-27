import { ProjectCard } from '@/components/cards/ProjectCard';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Projects = ({ projects }) => {
  return (
    <Section id="projects" band>
      <Reveal>
        <SectionHeading
          kicker="04 — Projects"
          title="Client work, embedded & AI."
          description="Personal builds that span mechanics, firmware and the model in the loop — alongside production websites shipped end-to-end at Content Pilot."
        />
      </Reveal>
      <div className="mt-[38px] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[22px]">
        {projects.map((project) => (
          <Reveal key={project.title}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
