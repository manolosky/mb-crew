import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/lib/icons';

export const ProjectCard = ({ project }) => {
  return (
    <div className="bg-surface border-line-soft hover:shadow-lift-lg flex flex-col overflow-hidden rounded-[20px] border transition duration-200 hover:-translate-y-1 hover:border-[#f0b285]">
      {/* Placeholder art area until real project images arrive */}
      <div className="border-line-soft relative flex h-[172px] items-center justify-center border-b bg-[repeating-linear-gradient(45deg,#f0efeb_0_11px,#e7e5df_11px_22px)]">
        <span className="bg-brand-gradient absolute top-3.5 left-3.5 rounded-full px-2.5 py-[5px] font-mono text-[11px] text-white">
          {project.kind}
        </span>
        <span className="text-dim rounded-lg bg-white/75 px-3.5 py-2 font-mono text-[12.5px]">
          project image
        </span>
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <div className="text-brand mb-2 font-mono text-xs">{project.tag}</div>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading hover:text-brand mb-2.5 inline-flex items-baseline gap-2 text-xl leading-[1.2] font-bold transition"
          >
            {project.title}
            <Icon name="fa-solid fa-arrow-up-right-from-square" className="text-xs opacity-60" />
          </a>
        ) : (
          <div className="font-heading mb-2.5 text-xl leading-[1.2] font-bold">{project.title}</div>
        )}
        <p className="text-body-soft mb-4 text-[14.5px] leading-[1.55]">{project.blurb}</p>
        <ul className="mb-[18px] flex list-disc flex-col gap-1.5 pl-[17px]">
          {project.points.map((point) => (
            <li key={point} className="text-[13.5px] leading-[1.5] text-[#57544c]">
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
      </div>
    </div>
  );
};
