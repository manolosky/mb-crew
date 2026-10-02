import { ClientWorkCard } from '@/components/cards/ClientWorkCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Projects = ({ projects, clientWork }) => {
  // The client-work summary slots in among the projects at its own (1-based) position.
  const cards = projects.map((project) => <ProjectCard key={project.title} project={project} />);
  cards.splice(
    clientWork.position - 1,
    0,
    <ClientWorkCard key="client-work" clientWork={clientWork} />,
  );

  return (
    <Section id="projects" band>
      <Reveal>
        <SectionHeading
          kicker="04 — Projects"
          title="Client work, AI & embedded."
          description="Production client work — search, integrations and WordPress at scale — alongside a personal build that spans firmware and mechanics."
        />
      </Reveal>
      <Reveal staggerChildren className="nav:grid-cols-2 mt-[38px] grid grid-cols-1 gap-[22px]">
        {cards}
      </Reveal>
    </Section>
  );
};
