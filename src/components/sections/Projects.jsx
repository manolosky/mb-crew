import { ClientWorkCard } from '@/components/cards/ClientWorkCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Projects = ({ projects, clientWork }) => {
  return (
    <Section id="projects" band>
      <Reveal>
        <SectionHeading
          kicker="04 — Projects"
          title="Client work, embedded & AI."
          description="Personal builds that span mechanics, firmware and the model in the loop — alongside production client work shipped end-to-end."
        />
      </Reveal>
      <Reveal
        staggerChildren
        className="mt-[38px] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[22px]"
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </Reveal>
      <Reveal direction="fade" className="mt-[22px]">
        <ClientWorkCard clientWork={clientWork} />
      </Reveal>
    </Section>
  );
};
