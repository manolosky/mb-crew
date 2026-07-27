import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Reveal } from '@/components/ui/Reveal';

// Timeline entry: gradient dot + fading line on the left, job card on the right.
export const ExperienceItem = ({ job }) => {
  return (
    <Reveal className="grid grid-cols-[22px_1fr] gap-[clamp(16px,3vw,30px)] pb-[34px]">
      <div className="flex flex-col items-center">
        <span className="bg-brand-gradient mt-[5px] h-4 w-4 flex-none rounded-full shadow-[0_0_0_5px_rgba(124,92,255,.14)]" />
        <span className="mt-1.5 w-0.5 flex-1 bg-gradient-to-b from-[#d9ddec] to-transparent" />
      </div>
      <Card
        hover
        className="rounded-[18px] p-[clamp(20px,3vw,28px)] hover:translate-y-0 hover:shadow-[0_16px_36px_rgba(108,92,255,.12)]"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="font-heading min-w-0 text-[clamp(18px,2.4vw,22px)] font-bold">
            {job.role}
          </div>
          <div className="text-brand font-mono text-[13px]">{job.period}</div>
        </div>
        <div className="text-muted mt-1 mb-4 text-[15px]">
          {job.company} · {job.place}
        </div>
        <ul className="mb-4 flex list-disc flex-col gap-2 pl-[18px]">
          {job.points.map((point) => (
            <li key={point} className="text-body text-[14.5px] leading-[1.55]">
              {point}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-[7px]">
          {job.stack.map((tech) => (
            <Chip key={tech} size="sm" className="border-line-soft bg-[#f2f3fa] text-[#5a6180]">
              {tech}
            </Chip>
          ))}
        </div>
      </Card>
    </Reveal>
  );
};
