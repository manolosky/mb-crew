import Image from 'next/image';

import { ProjectFrame } from '@/components/cards/ProjectFrame';
import { Chip } from '@/components/ui/Chip';
import { IconTile } from '@/components/ui/IconTile';
import { Icon } from '@/lib/icons';

// Decorative header for projects without an image: the systems they connect,
// as icon tiles on a shared line. Every step is the same width, so the line
// runs from the centre of the first tile to the centre of the last.
const FlowHeader = ({ steps }) => {
  return (
    <div aria-hidden="true" className="relative flex gap-[clamp(10px,2.5vw,28px)]">
      <span className="bg-brand-line absolute inset-x-9 top-5 h-px" />
      {steps.map((step) => (
        <span key={step.label} className="relative flex w-[72px] flex-col items-center gap-2">
          <IconTile>
            <Icon name={step.icon} />
          </IconTile>
          <span className="text-muted font-mono text-[11px]">{step.label}</span>
        </span>
      ))}
    </div>
  );
};

const ProjectHeader = ({ project }) => {
  if (undefined !== project.image) {
    return (
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.title}
        fill
        sizes="(max-width: 820px) 100vw, 540px"
        className="object-cover"
      />
    );
  }

  if (undefined !== project.flow) {
    return <FlowHeader steps={project.flow} />;
  }

  return null;
};

export const ProjectCard = ({ project }) => {
  return (
    <ProjectFrame badge={project.kind} header={<ProjectHeader project={project} />}>
      <div className="text-brand mb-2 font-mono text-xs">{project.tag}</div>
      <h3 className="font-heading mb-2.5 text-xl leading-[1.2] font-bold">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand inline-flex items-baseline gap-2 transition"
          >
            {project.title}
            <span className="sr-only">(opens in new tab)</span>
            <Icon name="fa-solid fa-arrow-up-right-from-square" className="text-xs opacity-60" />
          </a>
        ) : (
          project.title
        )}
      </h3>
      <p className="text-body-soft mb-[18px] text-[14.5px] leading-[1.55]">{project.blurb}</p>
      {project.points?.length ? (
        <ul className="-mt-0.5 mb-[18px] flex list-disc flex-col gap-1.5 pl-[17px]">
          {project.points.map((point) => (
            <li key={point} className="text-slate text-[13.5px] leading-[1.5]">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-[7px]">
        {project.tech.map((tech) => (
          <Chip key={tech} size="sm">
            {tech}
          </Chip>
        ))}
      </div>
      {project.attribution ? (
        <div className="border-line-soft text-faint mt-4 border-t pt-3 font-mono text-[11.5px] leading-[1.5]">
          {project.attribution}
        </div>
      ) : null}
    </ProjectFrame>
  );
};
