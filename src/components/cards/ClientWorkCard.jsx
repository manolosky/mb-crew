import { ProjectFrame } from '@/components/cards/ProjectFrame';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/lib/icons';

const HeaderStat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-gradient-brand font-heading text-[42px] leading-none font-bold">
      {value}
    </div>
    <div className="text-muted mt-2 text-xs">{label}</div>
  </div>
);

// Confidential client work rendered in the same card format as the personal
// projects — an aggregate summary, since those sites are covered by NDA.
export const ClientWorkCard = ({ clientWork }) => {
  return (
    <ProjectFrame
      badge="Professional / Client work"
      header={
        <div className="flex items-center gap-12">
          <HeaderStat value={clientWork.built} label="built end-to-end" />
          <HeaderStat value={clientWork.supported} label="projects supported" />
        </div>
      }
    >
      <div className="text-brand mb-2 font-mono text-xs">WordPress · Under NDA</div>
      <h3 className="font-heading mb-2.5 text-xl leading-[1.2] font-bold">
        {clientWork.built} production websites built for {clientWork.client} ({clientWork.period}).
      </h3>
      <p className="text-body-soft mb-4 text-[14.5px] leading-[1.55]">
        As {clientWork.role} for {clientWork.client}, over the {clientWork.period} I have developed{' '}
        {clientWork.built} production websites end-to-end — owning 100% of the development — and
        provide ongoing support for {clientWork.supported} live projects for the same client.
      </p>
      <p className="text-slate mb-[18px] text-[13.5px] leading-[1.5]">
        These sites are not listed publicly for confidentiality reasons; I am happy to walk through
        them in a closer conversation.
      </p>
      <div className="mt-auto">
        <Button size="sm" href="/contact">
          <Icon name="fa-solid fa-paper-plane" className="text-xs" /> Ask me about them
        </Button>
      </div>
    </ProjectFrame>
  );
};
