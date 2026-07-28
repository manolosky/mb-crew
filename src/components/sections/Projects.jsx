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
          title="Client work, AI & embedded."
          description="Production client work shipped end-to-end — alongside personal builds that span the model in the loop, firmware and mechanics."
        />
      </Reveal>
      <Reveal staggerChildren className="nav:grid-cols-2 mt-[38px] grid grid-cols-1 gap-[22px]">
        <ClientWorkCard clientWork={clientWork} />
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </Reveal>
    </Section>
  );
};
