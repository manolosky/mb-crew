import { Button } from '@/components/ui/Button';
import { Icon } from '@/lib/icons';

// Confidential client work rendered in the same card format as the personal
// projects — an aggregate summary, since those sites are covered by NDA.
export const ClientWorkCard = ({ clientWork }) => {
  return (
    <div className="bg-surface border-line-soft hover:shadow-lift-lg flex flex-col overflow-hidden rounded-[20px] border transition duration-200 hover:-translate-y-1 hover:border-[#b4560f]">
      {/* Stats header in place of a project image */}
      <div className="border-line-soft relative flex h-[172px] items-center justify-center gap-12 border-b bg-[repeating-linear-gradient(45deg,#1b1916_0_11px,#211e1a_11px_22px)]">
        <span className="bg-brand-gradient absolute top-3.5 left-3.5 rounded-full px-2.5 py-[5px] font-mono text-[11px] text-white">
          Professional / Client work
        </span>
        <div className="text-center">
          <div className="text-gradient-brand font-heading text-[42px] leading-none font-bold">
            {clientWork.built}
          </div>
          <div className="text-faint mt-2 text-xs">built end-to-end</div>
        </div>
        <div className="text-center">
          <div className="text-gradient-brand font-heading text-[42px] leading-none font-bold">
            {clientWork.supported}
          </div>
          <div className="text-faint mt-2 text-xs">projects supported</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <div className="text-brand mb-2 font-mono text-xs">WordPress · Under NDA</div>
        <h3 className="font-heading mb-2.5 text-xl leading-[1.2] font-bold">
          {clientWork.built} production websites built for {clientWork.client} ({clientWork.period}
          ).
        </h3>
        <p className="text-body-soft mb-4 text-[14.5px] leading-[1.55]">
          As {clientWork.role} for {clientWork.client}, over the {clientWork.period} I have
          developed {clientWork.built} production websites end-to-end — owning 100% of the
          development — and provide ongoing support for {clientWork.supported} live projects for the
          same client.
        </p>
        <p className="mb-[18px] text-[13.5px] leading-[1.5] text-[#a9a49a]">
          These sites are not listed publicly for confidentiality reasons; I am happy to walk
          through them in a closer conversation.
        </p>
        <div className="mt-auto">
          <Button size="sm" href="/contact">
            <Icon name="fa-solid fa-paper-plane" className="text-xs" /> Ask me about them
          </Button>
        </div>
      </div>
    </div>
  );
};
