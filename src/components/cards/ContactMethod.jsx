import { Icon } from '@/lib/icons';

// Frosted contact tile (email / phone) used on the gradient contact card.
export const ContactMethod = ({ label, value, href, icon }) => {
  return (
    <a
      href={href}
      className="flex max-w-full min-w-0 items-center gap-3.5 rounded-[14px] border border-white/20 bg-white/15 px-[22px] py-4 text-white backdrop-blur-sm transition hover:bg-white/25"
    >
      <Icon name={icon} className="text-lg opacity-85" />
      <span className="flex min-w-0 flex-col">
        <span className="mb-1 font-mono text-[11px] text-white/70 uppercase">{label}</span>
        <span className="text-[15.5px] font-semibold [overflow-wrap:anywhere]">{value}</span>
      </span>
    </a>
  );
};
