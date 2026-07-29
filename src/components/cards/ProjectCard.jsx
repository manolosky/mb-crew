import Image from 'next/image';

import { ProjectFrame } from '@/components/cards/ProjectFrame';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/lib/icons';

export const ProjectCard = ({ project }) => {
  return (
    <ProjectFrame
      badge={project.kind}
      header={
        undefined !== project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            sizes="(max-width: 820px) 100vw, 540px"
            className="object-cover"
          />
        ) : (
          <span className="text-muted rounded-lg bg-black/45 px-3.5 py-2 font-mono text-[12.5px]">
            project image
          </span>
        )
      }
    >
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
      <p className="text-body-soft mb-4 text-[14.5px] leading-[1.55]">{project.blurb}</p>
      <ul className="mb-[18px] flex list-disc flex-col gap-1.5 pl-[17px]">
        {project.points.map((point) => (
          <li key={point} className="text-slate text-[13.5px] leading-[1.5]">
            {point}
          </li>
        ))}
      </ul>
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
