import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Icon } from '@/lib/icons';

// Confidential client work: shown as an aggregate summary instead of
// individual project cards, since those sites are covered by NDA.
export const ClientWorkCard = ({ clientWork }) => {
  return (
    <Card className="rounded-[20px] p-[clamp(24px,4vw,40px)]">
      <div className="flex flex-wrap items-start gap-[clamp(20px,3vw,32px)]">
        <IconTile>
          <Icon name="fa-solid fa-globe" />
        </IconTile>
        <div className="min-w-[min(280px,100%)] flex-1">
          <div className="text-brand mb-2 font-mono text-xs tracking-[0.08em] uppercase">
            Client work · Under NDA
          </div>
          <h3 className="font-heading mb-3 text-[clamp(19px,2.4vw,24px)] leading-[1.2] font-bold">
            {clientWork.built} production websites built for {clientWork.client}.
          </h3>
          <p className="text-body-soft mb-5 max-w-[68ch] text-[14.5px] leading-[1.6]">
            As {clientWork.role} for {clientWork.client}, I have developed {clientWork.built}{' '}
            production websites end-to-end — owning 100% of the development — and provide ongoing
            support for {clientWork.supported} live projects for the same client. These sites are
            not listed publicly for confidentiality reasons; I am happy to walk through them in a
            closer conversation.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button size="sm" href="/contact">
              <Icon name="fa-solid fa-paper-plane" className="text-xs" /> Ask me about them
            </Button>
            <div className="flex gap-6">
              <div>
                <div className="text-gradient-brand font-heading text-[26px] leading-none font-bold">
                  {clientWork.built}
                </div>
                <div className="text-faint mt-1 text-xs">built end-to-end</div>
              </div>
              <div>
                <div className="text-gradient-brand font-heading text-[26px] leading-none font-bold">
                  {clientWork.supported}
                </div>
                <div className="text-faint mt-1 text-xs">projects supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
