import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { Icon } from '@/lib/icons';

export const HobbyCard = ({ hobby }) => {
  return (
    <Card hover className="p-[22px]">
      <IconTile className="mb-3.5">
        <Icon name={hobby.icon} />
      </IconTile>
      <div className="font-heading mb-1.5 text-[16.5px] font-semibold">{hobby.title}</div>
      <div className="text-faint text-[13.5px] leading-[1.5]">{hobby.note}</div>
    </Card>
  );
};
