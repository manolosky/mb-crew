import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { IconTile } from '@/components/ui/IconTile';
import { Icon } from '@/lib/icons';

export const SkillGroupCard = ({ group }) => {
  return (
    <Card className="bg-surface border-line-soft rounded-[18px] p-[22px]">
      <h3 className="font-heading mb-3.5 flex items-center gap-[11px] text-base font-semibold">
        <IconTile size="sm">
          <Icon name={group.icon} />
        </IconTile>
        {group.group}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <Chip key={item} interactive>
            {item}
          </Chip>
        ))}
      </div>
    </Card>
  );
};
